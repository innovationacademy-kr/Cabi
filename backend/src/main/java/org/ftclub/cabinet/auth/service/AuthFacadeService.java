package org.ftclub.cabinet.auth.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.concurrent.ExecutionException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.service.AdminCommandService;
import org.ftclub.cabinet.admin.admin.service.AdminQueryService;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.FtProfile;
import org.ftclub.cabinet.auth.domain.GoogleProfile;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserCommandService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.stereotype.Service;

/**
 * 인증 관련 비즈니스 로직을 처리하는 서비스입니다.
 */
@Slf4j
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
	private final JwtService jwtService;


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
			cookieManager.deleteCookie(res, req.getServerName(), REDIRECT_COOKIE_NAME);
			res.sendRedirect(redirect);
			return;
		}
		res.sendRedirect(authPolicyService.getMainHomeUrl());
	}

	public void userLogout(HttpServletResponse res) {
		Cookie userCookie = cookieManager.cookieOf(TokenProvider.USER_TOKEN_NAME, "");
		cookieManager.setCookieToClient(res, userCookie, "/", res.getHeader("host"));
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
}
