package org.ftclub.cabinet.auth.service;

import io.jsonwebtoken.Claims;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.config.security.JwtTokenConstants;
import org.ftclub.cabinet.config.security.JwtTokenProvider;
import org.ftclub.cabinet.config.security.TokenDto;
import org.ftclub.cabinet.config.security.UserInfoDto;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Authentication 인증 로직 관련 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {

	private final JwtTokenProvider tokenProvider;
	private final CookieManager cookieManager;

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

		generateTokenAndSetCookies(req.getServerName(), res, result, provider);
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
						new CustomAuthenticationException(ExceptionStatus.JWT_TOKEN_NOT_FOUND));
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
	public void generateTokenAndSetCookies(String serverName, HttpServletResponse res,
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


}
