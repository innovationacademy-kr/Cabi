package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.service.AdminCommandService;
import org.ftclub.cabinet.admin.admin.service.AdminQueryService;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.CustomOauth2User;
import org.ftclub.cabinet.auth.domain.FtOauthProfile;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.auth.domain.UserOauthConnection;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserCommandService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;


/**
 * OAuth 제공자와의 연동, 프로필 정보 변환, 사용자 연결 상태 관리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OauthService {


	private final UserQueryService userQueryService;
	private final UserCommandService userCommandService;
	private final FtApiProperties ftApiProperties;
	private final UserOauthConnectionQueryService userOauthConnectionQueryService;
	private final UserOauthConnectionCommandService userOauthConnectionCommandService;
	private final AdminQueryService adminQueryService;
	private final AuthPolicyService authPolicyService;
	private final AdminCommandService adminCommandService;
	private final ApplicationTokenManager applicationTokenManager;
	private final OauthProfileService oauthProfileService;
	private final CookieManager cookieManager;
	private final JwtService jwtService;

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
			HttpServletRequest request) {
		String oauthMail = oauth2User.getEmail();
		String providerId = oauth2User.getName();
		String providerType = oauth2User.getProvider();

		// adminPage 에서 요청 시
		if (isAdminRequest(request)) {
			Admin admin = adminQueryService.findByEmail(oauthMail)
					.orElseGet(() -> adminCommandService.createAdminByEmail(oauthMail));

			return new OauthResult(admin.getId(),
					admin.getRole().name(),
					authPolicyService.getAdminHomeUrl());
		}

		return userOauthConnectionQueryService.findByProviderIdAndProviderType(providerId,
						providerType)
				.map(this::handleExistingConnection)
				.orElseGet(() -> handleNewConnection(request, providerType, providerId, oauthMail));
	}

	private OauthResult handleExistingConnection(UserOauthConnection connection) {
		User user = connection.getUser();

		try {
			FtOauthProfile profile = getProfileByIntraName(
					applicationTokenManager.getFtAccessToken(),
					user.getName());

			String roles = FtRole.combineRolesToString(profile.getRoles());
			LocalDateTime blackHoledAt = profile.getBlackHoledAt();

			if (!user.isSameBlackHoledAtAndRole(blackHoledAt, roles)) {
				userCommandService.updateUserBlackholeAndRole(user, blackHoledAt, roles);
			}
		} catch (Exception e) {
			log.error("42 API 호출 도중 에러발생. blackHole, role update 생략. "
							+ "name = {}, message = {}",
					user.getName(), e.getMessage());
		}
		return new OauthResult(
				user.getId(), user.getRoles(),
				authPolicyService.getMainHomeUrl());
	}

	private OauthResult handleNewConnection(HttpServletRequest request, String providerType,
			String providerId, String oauthMail) {

		String refreshToken = Optional.ofNullable(
						cookieManager.getCookieValue(request, JwtTokenConstants.REFRESH_TOKEN))
				.orElseThrow(() -> new CustomAuthenticationException(
						ExceptionStatus.JWT_TOKEN_NOT_FOUND));

		UserInfoDto userInfoDto = jwtService.validateTokenAndGetUserInfo(refreshToken);
		if (!"ft".equals(userInfoDto.getOauth())) {
			throw new CustomAuthenticationException(ExceptionStatus.NOT_FT_LOGIN_STATUS);
		}
		if (userOauthConnectionQueryService.isExistByUserId(userInfoDto.getUserId())) {
			throw new CustomAuthenticationException(ExceptionStatus.OAUTH_EMAIL_ALREADY_LINKED);
		}

		User user = userQueryService.getUser(userInfoDto.getUserId());
		UserOauthConnection connection = UserOauthConnection.of(
				user,
				providerType,
				providerId,
				oauthMail
		);
		userOauthConnectionCommandService.save(connection);
		return new OauthResult(user.getId(), user.getRoles(),
				authPolicyService.getProfileUrl());
	}

	public boolean isAdminRequest(HttpServletRequest request) {
		String loginSource = cookieManager.getCookieValue(request, "login_source");

		log.debug("loginSource = {}", loginSource);
		return loginSource != null && loginSource.equals("admin");
	}

	/**
	 * ft 로그인 핸들링
	 *
	 * @param rootNode ftProfile -> JsonNode
	 * @return 필요한 정보만 파싱한 객체 {@link OauthResult}
	 */
	@Transactional
	public OauthResult handleFtLogin(JsonNode rootNode) {
		FtOauthProfile profile = oauthProfileService.convertJsonNodeToFtOauthProfile(rootNode);
		LocalDateTime blackHoledAt = profile.getBlackHoledAt();
		String roles = FtRole.combineRolesToString(profile.getRoles());

		User user = userQueryService.findUser(profile.getIntraName())
				.orElseGet(() -> userCommandService.createUserByFtOauthProfile(profile));
		// role, blackholedAt 검수
		if (!user.isSameBlackHoledAtAndRole(blackHoledAt, roles)) {
			userCommandService.updateUserBlackholeAndRole(user, blackHoledAt, roles);
		}
		return new OauthResult(user.getId(), user.getRoles(), authPolicyService.getMainHomeUrl());
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

		return oauthProfileService.convertJsonNodeToFtOauthProfile(result);
	}

	/**
	 * 외부 api -> 정보들을 갖고 parse
	 *
	 * @param name
	 * @param ftAccessToken
	 * @return
	 * @throws JsonProcessingException
	 */
	public boolean isAguUser(String name, String ftAccessToken) throws JsonProcessingException {
		FtOauthProfile profile = getProfileByIntraName(ftAccessToken, name);
		Set<FtRole> roles = profile.getRoles();
		return roles.contains(FtRole.AGU);
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
