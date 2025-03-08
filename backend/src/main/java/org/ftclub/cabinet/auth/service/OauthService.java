package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.service.AdminCommandService;
import org.ftclub.cabinet.admin.admin.service.AdminQueryService;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.EmailVerificationAlarm;
import org.ftclub.cabinet.alarm.service.AguCodeRedisService;
import org.ftclub.cabinet.auth.domain.CustomOauth2User;
import org.ftclub.cabinet.auth.domain.FtOauthProfile;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.auth.domain.UserOauthConnection;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.dto.UserOauthMailDto;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserCommandService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;


/**
 * OAuth 제공자와의 연동, 프로필 정보 변환, 사용자 연결 상태 관리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OauthService {

	private static final int CURSUS_INDEX = 1;

	private static final String VERIFICATION_API = "/v4/auth/AGU";
	private final UserQueryService userQueryService;
	private final UserCommandService userCommandService;
	private final FtApiProperties ftApiProperties;
	private final UserOauthConnectionQueryService userOauthConnectionQueryService;
	private final UserOauthConnectionCommandService userOauthConnectionCommandService;
	private final AuthenticationService authenticationService;
	private final AdminQueryService adminQueryService;
	private final AuthPolicyService authPolicyService;
	private final AdminCommandService adminCommandService;
	private final ApplicationTokenManager applicationTokenManager;
	private final AguCodeRedisService aguCodeRedisService;
	private final ApplicationEventPublisher eventPublisher;
	@Value("${cabinet.server.be-host}")
	private String beHost;

	/**
	 * ft oauth 로그인 외에 로그인 시도
	 *
	 * @param oauth2User
	 * @param request
	 * @return
	 */
	@Transactional
	public OauthResult handleExternalOAuthLogin(
			CustomOauth2User oauth2User,
			HttpServletRequest request) throws JsonProcessingException {
		String oauthMail = oauth2User.getEmail();
		String providerId = oauth2User.getName();
		String providerType = oauth2User.getProvider();

		// adminPage 에서 요청 시
		if (authenticationService.isAdminRequest(request)) {
			Admin admin = adminQueryService.findByEmail(oauthMail)
					.orElseGet(() -> adminCommandService.createAdminByEmail(oauthMail));

			return new OauthResult(admin.getId(),
					admin.getRole().name(),
					authPolicyService.getAdminHomeUrl());
		}

		Optional<UserOauthConnection> userConnection =
				userOauthConnectionQueryService.findByProviderIdAndProviderType(providerId,
						providerType);
		// 기존 연동 유저
		if (userConnection.isPresent()) {
			User user = userConnection.get().getUser();
			try {
				FtOauthProfile profile =
						getProfileByIntraName(applicationTokenManager.getFtAccessToken(),
								user.getName());
				String combinedRoles = FtRole.combineRolesToString(profile.getRoles());
				LocalDateTime blackHoledAt = profile.getBlackHoledAt();

				if (!user.isSameBlackHoledAtAndRole(blackHoledAt, combinedRoles)) {
					userCommandService.updateUserBlackholeAndRole(user, blackHoledAt,
							combinedRoles);
				}
			} catch (Exception e) {
				log.error("42 api 호출 도중, 에러가 발생했습니다. user = {}, message = {}",
						user.getName(), e.getMessage());
			}
			return new OauthResult(user.getId(),
					user.getRoles(),
					authPolicyService.getMainHomeUrl());
		}

		// 신규 연동 유저
		UserInfoDto userInfoDto = authenticationService.getAuthInfoFromCookie(request);

		// 이전 oauth 로그인 상태가 ft인지 검증
		if (!userInfoDto.getOauth().equals("ft")) {
			throw new CustomAuthenticationException(ExceptionStatus.NOT_FT_LOGIN_STATUS);
		}

		// 유저가 이미 다른 oauth 계정을 연동중이라면 에러
		if (userOauthConnectionQueryService.isExistByUserId(userInfoDto.getUserId())) {
			throw new CustomAuthenticationException(ExceptionStatus.OAUTH_EMAIL_ALREADY_LINKED);
		}

		User user = userQueryService.getUser(userInfoDto.getUserId());
		UserOauthConnection connection =
				UserOauthConnection.of(user, providerType, providerId, oauthMail);
		userOauthConnectionCommandService.save(connection);
		return new OauthResult(user.getId(), user.getRoles(), authPolicyService.getProfileUrl());
	}

	/**
	 * ft 로그인 핸들링
	 *
	 * @param rootNode ftProfile -> JsonNode
	 * @return 필요한 정보만 파싱한 객체 {@link OauthResult}
	 */
	@Transactional
	public OauthResult handleFtLogin(JsonNode rootNode) {
		FtOauthProfile profile = convertJsonNodeToProfile(rootNode);
		String combinedRoles = FtRole.combineRolesToString(profile.getRoles());
		LocalDateTime blackHoledAt = profile.getBlackHoledAt();

		User user = userQueryService.findUser(profile.getIntraName())
				.orElseGet(() -> userCommandService.createUserByFtOauthProfile(profile));

		// role, blackholedAt 검수
		if (!user.isSameBlackHoledAtAndRole(profile.getBlackHoledAt(), combinedRoles)) {
			userCommandService.updateUserBlackholeAndRole(user, blackHoledAt, combinedRoles);
		}
		return new OauthResult(user.getId(), user.getRoles(), authPolicyService.getMainHomeUrl());
	}

	/**
	 * 42 로그인 시 받은 profile -> jsonNode 파싱
	 *
	 * @param jsonNode
	 * @return
	 */
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

		// inactive에 대해서는 단일 권한을 반환. inactive / blackhole
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

	/**
	 * 42에서 발급한 accessToken을 활용해 유저의 정보를 받아옵니다
	 *
	 * @param accessToken
	 * @param intraName
	 * @return
	 * @throws JsonProcessingException
	 */
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

	/**
	 * 이름으로 유저를 검색합니다
	 * <p>
	 * AGU 유저라면 code를 만들어 redis에 저장하고, 메일을 발송합니다.
	 *
	 * @param name
	 * @return
	 * @throws JsonProcessingException
	 */
	public UserOauthMailDto requestTemporaryLogin(String name) throws JsonProcessingException {
		User user = userQueryService.getUserByName(name);
		// agu 상태인지 검증
		if (!user.getRoles().contains("AGU")
				&& !isAguUser(name, applicationTokenManager.getFtAccessToken())) {
			throw ExceptionStatus.ACCESS_DENIED.asServiceException();
		}
		// 코드가 있는데 발급 요청이면 에러(3분 내로 재요청)
		if (aguCodeRedisService.isAlreadyExist(name)) {
			throw ExceptionStatus.CODE_ALREADY_SENT.asServiceException();
		}

		String aguCode = aguCodeRedisService.createAguCode(user.getName());

		String verificationLink = generateVerificationLink(aguCode, name);
		AlarmEvent alarmEvent =
				AlarmEvent.of(user.getId(), new EmailVerificationAlarm(verificationLink));
		eventPublisher.publishEvent(alarmEvent);
		return new UserOauthMailDto(user.getEmail());
	}

	private String generateVerificationLink(String aguCode, String name) {
		return UriComponentsBuilder.fromHttpUrl(beHost)
				.path(VERIFICATION_API)
				.queryParam("code", aguCode)
				.queryParam("name", name)
				.encode(StandardCharsets.UTF_8)
				.build()
				.toUriString();
	}

	/**
	 * public 로그인 요청 시 임시 토큰을 만듭니다.
	 *
	 * @param name
	 * @throws IOException
	 */
	public OauthResult handlePublicLogin(String name) {
		User user = userQueryService.findUser(name).orElseThrow(
				ExceptionStatus.NOT_FOUND_USER::asServiceException);

		return new OauthResult(user.getId(), user.getRoles(), authPolicyService.getMainHomeUrl());
	}


}
