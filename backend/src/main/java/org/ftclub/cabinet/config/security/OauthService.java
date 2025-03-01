package org.ftclub.cabinet.config.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.admin.admin.service.AdminQueryService;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.auth.domain.UserOauthConnection;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.ftclub.cabinet.auth.service.AuthenticationService;
import org.ftclub.cabinet.auth.service.UserOauthConnectionCommandService;
import org.ftclub.cabinet.auth.service.UserOauthConnectionQueryService;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserCommandService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


@Slf4j
@Service
@RequiredArgsConstructor
public class OauthService {

	private static final int CURSUS_INDEX = 1;
	private final UserQueryService userQueryService;
	private final UserCommandService userCommandService;
	private final FtApiProperties ftApiProperties;
	private final UserOauthConnectionQueryService userOauthConnectionQueryService;
	private final UserOauthConnectionCommandService userOauthConnectionCommandService;
	private final AuthenticationService authenticationService;
	private final AdminQueryService adminQueryService;
	private final AuthPolicyService authPolicyService;

	public OauthResult handleExternalOAuthLogin(
			CustomOauth2User oauth2User,
			HttpServletRequest request) {
		String oauthMail = oauth2User.getEmail();
		String providerId = oauth2User.getName();
		String providerType = oauth2User.getProvider();

		if (adminQueryService.isAdminEmail(oauthMail)) {
			Admin admin = adminQueryService.getByEmail(oauthMail);

			return OauthResult.builder()
					.userId(admin.getId())
					.roles(AdminRole.ADMIN.name())
					.redirectionUrl(authPolicyService.getAdminHomeUrl())
					.build();
		}

		Optional<UserOauthConnection> userConnection =
				userOauthConnectionQueryService.findByProviderIdAndProviderType(providerId,
						providerType);
		// 기존 연동 유저
		if (userConnection.isPresent()) {
			User user = userConnection.get().getUser();

			return OauthResult.builder()
					.userId(user.getId())
					.roles(user.getRoles())
					.redirectionUrl(authPolicyService.getMainHomeUrl())
					.build();
		}

		UserInfoDto userInfoDto = authenticationService.getAuthInfoFromCookie(request);
		if (!userInfoDto.getOauth().equals("ft")) {
			throw new CustomAuthenticationException(ExceptionStatus.NOT_FT_LOGIN_STATUS);
		}
		// 해당 oauth 계정을 다른 유저가 사용하고있다면 에러
		if (userOauthConnectionQueryService.isExistByOauthIdAndType(providerId, providerType)) {
			throw new CustomAuthenticationException(ExceptionStatus.OAUTH_EMAIL_ALREADY_LINKED);
		}

		// 유저가 이미 다른 oauth 계정을 연동중이라면 에러
		User user = userQueryService.getUser(userInfoDto.getUserId());
		if (userOauthConnectionQueryService.isExistByUserId(user.getId())) {
			throw new CustomAuthenticationException(ExceptionStatus.OAUTH_EMAIL_ALREADY_LINKED);
		}

		UserOauthConnection connection =
				UserOauthConnection.of(user, providerType, providerId, oauthMail);
		userOauthConnectionCommandService.save(connection);
		return OauthResult.builder()
				.userId(user.getId())
				.email(user.getEmail())
				.name(user.getName())
				.roles(user.getRoles())
				.redirectionUrl(authPolicyService.getProfileUrl())
				.build();
	}


	public OauthResult handleFtLogin(JsonNode rootNode) {
		FtOauthProfile profile = convertJsonNodeToProfile(rootNode);
		String combinedRoles = FtRole.combineRolesToString(profile.getRoles());

		LocalDateTime blackHoledAt = profile.getBlackHoledAt();

		User user = userQueryService.findUser(profile.getIntraName())
				.orElseGet(() -> userCommandService.createUserByFtOauthProfile(profile));

		// role, blackholedAt 검수
		if (!user.isSameBlackHoledAtAndRole(profile.getBlackHoledAt(), combinedRoles)) {
			userCommandService.updateUserBlackholeAndRole(user.getId(), blackHoledAt,
					combinedRoles);
		}
		return OauthResult.builder()
				.userId(user.getId())
				.blackHoledAt(user.getBlackholedAt())
				.email(user.getEmail())
				.name(user.getName())
				.roles(user.getRoles())
				.redirectionUrl(authPolicyService.getMainHomeUrl())
				.build();
	}

	public FtOauthProfile convertJsonNodeToProfile(JsonNode jsonNode) {
		String intraName = jsonNode.get("login").asText();
		String email = jsonNode.get("email").asText();
		if (intraName == null || email == null) {
			throw ExceptionStatus.INCORRECT_ARGUMENT.asServiceException();
		}

		LocalDateTime blackHoledAt = determineBlackHoledAt(jsonNode);
		List<FtRole> roles = determineFtRoles(jsonNode, blackHoledAt);
		return FtOauthProfile.builder()
				.intraName(intraName)
				.email(email)
				.roles(roles)
				.blackHoledAt(blackHoledAt)
				.build();
	}

	public List<FtRole> determineFtRoles(JsonNode rootNode, LocalDateTime blackHoledAt) {
		boolean isUserStaff = rootNode.get("staff?").asBoolean();
		boolean isActive = rootNode.get("active?").asBoolean();
		JsonNode cursusUsersNode = rootNode.get("cursus_users");
		List<FtRole> roles = new ArrayList<>();

		// inactive에 대해서는 단일 권한을 반환.
		if (!isActive) {
			return handleInactiveUser(blackHoledAt, roles);
		}
		// user -> 여러 권한 핸들링.
		roles.add(FtRole.USER);
		if (cursusUsersNode.size() < CURSUS_INDEX + 1) {
			roles.add(FtRole.PISCINER);
		}
		if (isUserStaff) {
			roles.add(FtRole.STAFF);
		}
		if (blackHoledAt == null) {
			roles.add(FtRole.MEMBER);
		} else {
			roles.add(FtRole.CADET);
		}

		return roles;
	}

	private List<FtRole> handleInactiveUser(LocalDateTime blackHoledAt, List<FtRole> roles) {
		if (blackHoledAt.isAfter(LocalDateTime.now())) {
			roles.add(FtRole.AGU);
		} else {
			roles.add(FtRole.INACTIVE);
		}
		return roles;
	}

	private LocalDateTime determineBlackHoledAt(JsonNode rootNode) {
		JsonNode cursusNode = rootNode.get("cursus_users");
		int index = cursusNode.size() > 1 ? 1 : 0;

		JsonNode blackHoledAtNode = cursusNode.get(index).get("blackholed_at");
		if (blackHoledAtNode.isNull() || blackHoledAtNode.asText().isEmpty()) {
			return null;
		}
		return DateUtil.convertStringToDate(blackHoledAtNode.asText());
	}

	public FtOauthProfile getProfileByIntraName(String accessToken, String intraName)
			throws JsonProcessingException {
		log.info("Called getProfileByIntraName {}", intraName);
		JsonNode result = WebClient.create().get()
				.uri(ftApiProperties.getUsersInfoUri() + '/' + intraName)
				.accept(MediaType.APPLICATION_JSON)
				.headers(h -> h.setBearerAuth(accessToken))
				.retrieve()
				.bodyToMono(JsonNode.class)
				.block();
		return convertJsonNodeToProfile(result);
	}

	public boolean isAguUser(String name, String ftAccessToken) throws JsonProcessingException {
		FtOauthProfile profile = getProfileByIntraName(ftAccessToken, name);
		List<FtRole> roles = profile.getRoles();
		return roles.contains(FtRole.AGU);
	}

}
