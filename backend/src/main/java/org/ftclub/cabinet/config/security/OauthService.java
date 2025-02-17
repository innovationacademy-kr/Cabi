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
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserCommandService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class OauthService {

	private static final int CURSUS_INDEX = 1;
	private final UserQueryService userQueryService;
	private final UserCommandService userCommandService;
	@Value("${spring.security.oauth2.client.registration.ft.client-name}")
	private String ftProvider;
	@Value("${spring.security.oauth2.client.registration.google.client-name}")
	private String googleProvider;

	public User handleGoogleLogin(JsonNode rootNode, CustomOauth2User ftUser) {

		if (!ftUser.getProvider().equals(ftProvider)) {
			log.error("Google OAuth 요청 중, 42 OAuth 인증 상태가 유효하지 않습니다.");
			throw ExceptionStatus.INVALID_OAUTH_TYPE.asSpringSecurityException();
		}

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

	public User handleFtLogin(JsonNode rootNode)
			throws JsonProcessingException {
		FtOauthProfile profile = convertJsonNodeToProfile(rootNode);
		List<FtRole> roles = profile.getRoles();
		String combinedRoles = FtRole.combineRolesToString(roles);

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

	public FtOauthProfile convertJsonNodeToProfile(JsonNode jsonNode)
			throws JsonProcessingException {
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
		JsonNode blackHoledAtNode = rootNode.get("cursus_users").get(CURSUS_INDEX)
				.get("blackholed_at");
		if (blackHoledAtNode.isNull() || blackHoledAtNode.asText().isEmpty()) {
			return null;
		}
		return DateUtil.convertStringToDate(blackHoledAtNode.asText());
	}
}
