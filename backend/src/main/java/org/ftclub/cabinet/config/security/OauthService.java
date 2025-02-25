package org.ftclub.cabinet.config.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.config.FtApiProperties;
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

	public User handleGoogleLogin(JsonNode rootNode, CustomOauth2User ftUser) {

		String oauthMail = rootNode.get("email").asText();
		Optional<User> userByOauthMail = userQueryService.findByOauthEmail(oauthMail);

		if (userByOauthMail.isPresent()) {
			log.error("Google의 메일 {}은 이미 다른 사용자{}와 연동되어 있습니다",
					oauthMail, userByOauthMail.get().getName());
			throw ExceptionStatus.DUPLICATED_OAUTH_MAIL.asSpringSecurityException();
		}
		// ftUser, google email 갖고 연동하기
		return userCommandService.linkOauthAccount(ftUser.getName(), oauthMail);
	}

	public User handleFtLogin(JsonNode rootNode) {
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
		return user;
	}

	public FtOauthProfile convertJsonNodeToProfile(JsonNode jsonNode) {
		String intraName = jsonNode.get("login").asText();
		String email = jsonNode.get("email").asText();
		log.info("user Information = {}", jsonNode);
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
