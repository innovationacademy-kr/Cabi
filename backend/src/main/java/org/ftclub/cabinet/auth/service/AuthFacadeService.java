package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.service.AdminCommandService;
import org.ftclub.cabinet.admin.admin.service.AdminQueryService;
import org.ftclub.cabinet.alarm.domain.EmailVerificationAlarm;
import org.ftclub.cabinet.alarm.service.VerificationCodeRedisService;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.FtProfile;
import org.ftclub.cabinet.auth.domain.GoogleProfile;
import org.ftclub.cabinet.config.security.AccessTokenDto;
import org.ftclub.cabinet.config.security.JwtTokenProvider;
import org.ftclub.cabinet.config.security.OauthService;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.ftclub.cabinet.dto.OauthLinkDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.service.JwtRedisService;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserCommandService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 인증 관련 비즈니스 로직을 처리하는 서비스입니다.
 */
@Service
@RequiredArgsConstructor
public class AuthFacadeService {

	private static final String REDIRECT_COOKIE_NAME = "redirect";
	private final UserQueryService userQueryService;
	private final UserCommandService userCommandService;
	private final AdminQueryService adminQueryService;
	private final AdminCommandService adminCommandService;
	private final UserOauthService userOauthService;
	private final AdminOauthService adminOauthService;
	private final AuthPolicyService authPolicyService;
	private final TokenProvider tokenProvider;
	private final CookieManager cookieManager;
	private final ApplicationEventPublisher eventPublisher;
	private final OauthService oauthService;
	private final VerificationCodeRedisService verificationCodeRedisService;
	private final JwtTokenProvider jwtTokenProvider;
	private final ApplicationTokenManager applicationTokenManager;
	private final JwtRedisService jwtRedisService;
	private final UserOauthConnectionQueryService userOauthConnectionQueryService;
	private final UserOauthConnectionCommandService userOauthConnectionCommandService;
	@Value("${cabinet.server.be-host}")
	private String beHost;

	/**
	 * 유저 로그인 페이지로 리다이렉트합니다.
	 *
	 * @param req 요청 시의 서블렛 {@link HttpServletRequest}
	 * @param res 응답 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	public void requestUserLogin(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		String redirect = req.getParameter(REDIRECT_COOKIE_NAME);
		if (redirect != null) {
			cookieManager.setCookieToClient(
					res, cookieManager.cookieOf(REDIRECT_COOKIE_NAME, redirect),
					"/", req.getServerName());
		}
		userOauthService.requestLogin(res);
	}

	/**
	 * 관리자 로그인 페이지로 리다이렉트합니다.
	 *
	 * @param res 응답 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	public void requestAdminLogin(HttpServletResponse res) throws IOException {
		adminOauthService.requestLogin(res);
	}

	/**
	 * 유저 로그인 콜백으로 받은 authorization_code로 유저 프로필 정보를 가져오고, 반환합니다.
	 * <p>
	 * 유저가 처음 로그인 한 경우에는 유저를 생성합니다.
	 *
	 * @param code 유저 로그인 콜백 시 발급받은 authorization_code
	 * @throws IOException          HTTP 통신에서 일어나는 입출력 예외
	 * @throws ExecutionException   비동기 처리시 스레드에서 발생한 오류 처리 예외
	 * @throws InterruptedException 비동기 처리시 스레드 종료를 위한 예외
	 */
	public void handleUserLogin(HttpServletRequest req, HttpServletResponse res, String code)
			throws IOException, ExecutionException, InterruptedException {
		FtProfile profile = userOauthService.getProfileByCode(code);
		User user = userQueryService.findUser(profile.getIntraName())
				.orElseGet(() -> userCommandService.createUserByFtProfile(profile));
		// 블랙홀이 API에서 가져온 날짜와 다르다면 갱신
		if (!user.isSameBlackholedAt(profile.getBlackHoledAt())) {
			userCommandService.updateUserBlackholeStatus(user.getId(), profile.getBlackHoledAt());
		}
		String token = tokenProvider.createUserToken(user, LocalDateTime.now());
		Cookie cookie = cookieManager.cookieOf(TokenProvider.USER_TOKEN_NAME, token);
		cookieManager.setCookieToClient(res, cookie, "/", req.getServerName());
		if (cookieManager.getCookieValue(req, REDIRECT_COOKIE_NAME) != null) {
			String redirect = cookieManager.getCookieValue(req, REDIRECT_COOKIE_NAME);
			cookieManager.deleteCookie(res, REDIRECT_COOKIE_NAME);
			res.sendRedirect(redirect);
			return;
		}
		res.sendRedirect(authPolicyService.getMainHomeUrl());
	}

	public void handlePublicLogin(HttpServletRequest req, HttpServletResponse res, String name)
			throws IOException {

		User user = userQueryService.findUser(name).orElseThrow(
				ExceptionStatus.NOT_FOUND_USER::asServiceException);
		String token = tokenProvider.createUserToken(user, LocalDateTime.now());
		Cookie cookie = cookieManager.cookieOf(TokenProvider.USER_TOKEN_NAME, token);
		cookieManager.setCookieToClient(res, cookie, "/", req.getServerName());
		if (cookieManager.getCookieValue(req, REDIRECT_COOKIE_NAME) != null) {
			String redirect = cookieManager.getCookieValue(req, REDIRECT_COOKIE_NAME);
			cookieManager.deleteCookie(res, REDIRECT_COOKIE_NAME);
			res.sendRedirect(redirect);
			return;
		}
		res.sendRedirect(authPolicyService.getMainHomeUrl());
	}

	/**
	 * 관리자 로그인 콜백으로 받은 authorization_code로 관리자 프로필 정보를 가져오고, 반환합니다.
	 * <p>
	 * 관리자가 처음 로그인 한 경우에는 관리자를 생성합니다.
	 *
	 * @param code 관리자 로그인 콜백 시 발급받은 authorization_code
	 * @throws IOException          HTTP 통신에서 일어나는 입출력 예외
	 * @throws ExecutionException   비동기 처리시 스레드에서 발생한 오류 처리 예외
	 * @throws InterruptedException 비동기 처리시 스레드 종료를 위한 예외
	 */
	public void handleAdminLogin(HttpServletRequest req, HttpServletResponse res, String code)
			throws IOException, ExecutionException, InterruptedException {
		GoogleProfile profile = adminOauthService.getProfileByCode(code);
		Admin admin = adminQueryService.findByEmail(profile.getEmail())
				.orElseGet(() -> adminCommandService.createAdminByEmail(profile.getEmail()));
		String token = tokenProvider.createAdminToken(admin, LocalDateTime.now());
		Cookie cookie = cookieManager.cookieOf(TokenProvider.ADMIN_TOKEN_NAME, token);
		cookieManager.setCookieToClient(res, cookie, "/", req.getServerName());
		res.sendRedirect(authPolicyService.getAdminHomeUrl());
	}

	/**
	 * 마스터 로그인을 처리합니다.
	 * <p>
	 * 정적으로 설정된 마스터 계정 정보와 일치하는지 확인합니다.
	 *
	 * @param masterLoginDto 마스터 로그인 정보 {@link MasterLoginDto}
	 * @param req            요청 시의 서블렛 {@link HttpServletRequest}
	 * @param res            요청 시의 서블렛 {@link HttpServletResponse}
	 * @param now            현재 시각
	 */
	public void masterLogin(MasterLoginDto masterLoginDto, HttpServletRequest req,
			HttpServletResponse res, LocalDateTime now) {
		// TODO : 서비스로 빼기
		if (!authPolicyService.isMatchWithMasterAuthInfo(masterLoginDto.getId(),
				masterLoginDto.getPassword())) {
			throw ExceptionStatus.UNAUTHORIZED_ADMIN.asServiceException();
		}
		Admin master = adminQueryService.findByEmail(authPolicyService.getMasterEmail())
				.orElseThrow(ExceptionStatus.UNAUTHORIZED_ADMIN::asServiceException);
		String masterToken = tokenProvider.createAdminToken(master, now);
		Cookie cookie = cookieManager.cookieOf(TokenProvider.ADMIN_TOKEN_NAME, masterToken);
		cookieManager.setCookieToClient(res, cookie, "/", req.getServerName());
	}

	/**
	 * 유저 로그아웃을 처리합니다.
	 * <p>
	 * access, refresh 토큰을 사용 처리합니다.
	 * <p>
	 * 모든 쿠키를 제거합니다.
	 *
	 * @param res 요청 시의 서블렛 {@link HttpServletResponse}
	 */
	public void userLogout(
			HttpServletRequest request,
			HttpServletResponse response,
			Long userId,
			String refreshToken) {
//		Cookie userCookie = cookieManager.cookieOf(TokenProvider.USER_TOKEN_NAME, "");
//		cookieManager.setCookieToClient(res, userCookie, "/", res.getHeader("host"));

		// accessToken, refreshToken 사용 처리
		String accessToken = jwtTokenProvider.extractToken(request);
		if (accessToken != null && refreshToken != null) {
			jwtRedisService.addUsedTokens(userId, accessToken, refreshToken);
		}
		cookieManager.deleteAllCookies(request, response);
	}

	/**
	 * 관리자 로그아웃을 처리합니다.
	 * <p>
	 * 쿠키에 저장된 관리자 토큰을 제거합니다.
	 *
	 * @param res 요청 시의 서블렛 {@link HttpServletResponse}
	 */
	public void adminLogout(HttpServletResponse res) {
		Cookie adminCookie = cookieManager.cookieOf(TokenProvider.ADMIN_TOKEN_NAME, "");
		cookieManager.setCookieToClient(res, adminCookie, "/", res.getHeader("host"));
	}

	/**
	 * 1. DB에 유저가 있는지 확인, AGU 상태인지 확인
	 * <p>
	 * 2. 연동 계정으로 2FA 코드 혹은 링크 발송
	 * <p>
	 * 3. 코드가 맞는지 검증
	 *
	 * @param name
	 */
	@Transactional
	public void requestTemporaryLogin(String name) throws JsonProcessingException {
		User user = userQueryService.getUserByName(name);
		// agu 상태인지 검증하는 로직.. 로그인이 아니라 profile 만 받아오도록 ftOauthProfile?
		if (!user.getRoles().contains("AGU")
				&& !oauthService.isAguUser(name, applicationTokenManager.getFtAccessToken())) {
			throw ExceptionStatus.ACCESS_DENIED.asServiceException();
		}
		String tmpToken = UUID.randomUUID().toString();

		verificationCodeRedisService.createVerificationCode(user.getName(), tmpToken);
		String verificationLink = beHost + "/verification?code=" + tmpToken +
				"&name=" + URLEncoder.encode(name, StandardCharsets.UTF_8);

		eventPublisher.publishEvent(new EmailVerificationAlarm(verificationLink));
	}

	public AccessTokenDto verifyTemporaryCode(String name, String code) {
		User user = userQueryService.getUserByName(name);
		verificationCodeRedisService.verifyTemporaryCode(name, code);

		verificationCodeRedisService.deleteVerificationCode(name, code);
		String temporaryToken =
				jwtTokenProvider.createAGUToken(user.getId());
		return AccessTokenDto.builder()
				.accessToken(temporaryToken)
				.build();
	}

	public OauthLinkDto generateOauthLink(Long userId, String oauth) {
		if (!oauth.equals("ft")) {
			throw ExceptionStatus.NOT_FT_LOGIN_STATUS.asServiceException();
		}
		String linkCode = UUID.randomUUID().toString();

		verificationCodeRedisService.createOauthCodeLink(userId, linkCode);
		return new OauthLinkDto(linkCode);
	}

	public void deleteOauthMail(Long userId) {
		userOauthConnectionCommandService.deleteByUserId(userId);
	}
}
