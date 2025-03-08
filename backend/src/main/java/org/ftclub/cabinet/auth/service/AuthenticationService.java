package org.ftclub.cabinet.auth.service;

import io.jsonwebtoken.Claims;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.alarm.service.AguCodeRedisService;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.jwt.service.JwtRedisService;
import org.ftclub.cabinet.jwt.service.JwtTokenProvider;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * 토큰 관리, 인증 정보 관리, 인가 부여
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {


	private final JwtTokenProvider tokenProvider;
	private final CookieManager cookieManager;
	private final UserQueryService userQueryService;
	private final AuthPolicyService authPolicyService;
	private final AguCodeRedisService aguCodeRedisService;
	private final JwtRedisService jwtRedisService;
	private final UserOauthConnectionCommandService userOauthConnectionCommandService;

	@Value("${cabinet.server.be-host}")
	private String beHost;

	/**
	 * 토큰을 생성해 cookie에 저장하고, securityContextHolder에 정보를 저장합니다.
	 *
	 * @param req      HttpServletRequest
	 * @param res      HttpServletResponse
	 * @param result   oauthLogin 파싱 결과
	 * @param provider oauthLogin 타입
	 */
	public void processAuthentication(HttpServletRequest req, HttpServletResponse res,
			OauthResult result, String provider) {

		generateTokensAndSetCookies(req.getServerName(), res, result, provider);
		Authentication auth = createAuthenticationForUser(result, provider);
		SecurityContextHolder.getContext().setAuthentication(auth);
	}

	/**
	 * oauth2 Login 직전 로그인 쿠키를 통해 유저 정보 생성
	 *
	 * @param request
	 * @return
	 */
	public UserInfoDto getAuthInfoFromCookie(HttpServletRequest request) {
		String refreshToken = Optional.ofNullable(
						cookieManager.getCookieValue(request, JwtTokenConstants.REFRESH_TOKEN))
				.orElseThrow(() ->
						new CustomAuthenticationException(ExceptionStatus.NOT_FT_LOGIN_STATUS));
		Claims claims = tokenProvider.parseValidToken(refreshToken);

		Long userId = claims.get(JwtTokenConstants.USER_ID, Long.class);
		String prevOauth = claims.get(JwtTokenConstants.OAUTH, String.class);
		String roles = claims.get(JwtTokenConstants.ROLES, String.class);

		if (userId == null || prevOauth == null || roles == null) {
			throw new CustomAuthenticationException(ExceptionStatus.JWT_INVALID);
		}

		return new UserInfoDto(userId, prevOauth, roles);
	}

	/**
	 * 토큰을 만들어 쿠키에 저장합니다
	 *
	 * @param serverName
	 * @param res
	 * @param user
	 * @param provider
	 */
	public void generateTokensAndSetCookies(String serverName, HttpServletResponse res,
			OauthResult user, String provider) {
		TokenDto tokens = tokenProvider.createTokens(
				user.getUserId(),
				user.getRoles(),
				provider
		);
		cookieManager.setTokenCookies(res, tokens, serverName);
	}

	/**
	 * SecurityContextHolder에 저장할 유저 정보
	 *
	 * @param user
	 * @param provider
	 * @return
	 */
	public Authentication createAuthenticationForUser(OauthResult user, String provider) {

		UserInfoDto userInfoDto =
				new UserInfoDto(user.getUserId(), provider, user.getRoles());

		List<GrantedAuthority> authorityList = Stream.of(user.getRoles().split(FtRole.DELIMITER))
				.map(role -> new SimpleGrantedAuthority(FtRole.ROLE + role))
				.collect(Collectors.toList());

		return new UsernamePasswordAuthenticationToken(userInfoDto, null, authorityList);
	}


	/**
	 * 토큰들을 블랙리스트에 추가하고, 쿠키를 제거합니다.
	 *
	 * @param request
	 * @param response
	 * @param userId
	 * @param refreshToken
	 */
	public void userLogout(
			HttpServletRequest request,
			HttpServletResponse response,
			Long userId,
			String refreshToken) throws IOException {

		// accessToken, refreshToken 사용 처리
		String accessToken = tokenProvider.extractToken(request);
		if (accessToken != null && refreshToken != null) {
			jwtRedisService.addUsedTokens(userId, accessToken, refreshToken);
		}
		// 내부 모든 쿠키 삭제
		cookieManager.deleteAllCookies(request.getCookies(), response);
	}

	public void requestAdminLogin(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		// 쿠키에 로그인 현상 저장
		Cookie cookie = cookieManager.cookieOf("login_source", "admin");
		cookie.setMaxAge(30);
		cookie.setSecure(true);
		cookieManager.setCookieToClient(res, cookie, "/", req.getServerName());

		res.sendRedirect(beHost + "/oauth2/authorization/google");
	}

	public boolean isAdminRequest(HttpServletRequest request) {
		String loginSource = cookieManager.getCookieValue(request, "login_source");
		log.info("loginSource = {}", loginSource);
		return loginSource != null && loginSource.equals("admin");
	}


	/**
	 * redis 내의 코드와 비교하여 검증합니다.
	 * <p>
	 * 성공 시 임시토큰을 쿠키에 설정하고, AGU 페이지로 리다이렉트합니다.
	 *
	 * @param name
	 * @param code
	 * @return
	 */
	public void verifyTemporaryCode(HttpServletRequest req,
			HttpServletResponse res,
			String name,
			String code) throws IOException {

		User user = userQueryService.getUserByName(name);
		aguCodeRedisService.verifyTemporaryCode(name, code);

		aguCodeRedisService.removeAguCode(name);
		String temporaryToken =
				tokenProvider.createAGUToken(user.getId());

		Cookie cookie = new Cookie(JwtTokenConstants.ACCESS_TOKEN, temporaryToken);
		cookie.setSecure(true);
		cookie.setHttpOnly(true);
		cookie.setMaxAge(60 * 60 * 100);
		cookieManager.setToClient(res, cookie, "/", req.getServerName());

		res.sendRedirect(authPolicyService.getAGUUrl());
	}

	/**
	 * 계정 연동을 해지합니다.
	 *
	 * @param userId
	 */
	public void deleteOauthMail(Long userId) {
		userOauthConnectionCommandService.deleteByUserId(userId);
	}
}
