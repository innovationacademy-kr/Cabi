package org.ftclub.cabinet.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.config.security.CustomOauth2User;
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


	public UserInfoDto getAuthInfoFromCookie(HttpServletRequest request) {
		String refreshToken = Optional.ofNullable(
						cookieManager.getCookieValue(request, JwtTokenConstants.REFRESH_TOKEN))
				.orElseThrow(() ->
						new CustomAuthenticationException(ExceptionStatus.JWT_TOKEN_NOT_FOUND));
		try {
			Claims claims = tokenProvider.parseValidToken(refreshToken);

			Long userId = claims.get(JwtTokenConstants.USER_ID, Long.class);
			String prevOauth = claims.get(JwtTokenConstants.OAUTH, String.class);

			if (userId == null || prevOauth == null) {
				throw new CustomAuthenticationException(ExceptionStatus.JWT_INVALID);
			}

			return UserInfoDto.builder()
					.userId(userId)
					.oauth(prevOauth)
					.build();
		} catch (ExpiredJwtException e) {
			throw new CustomAuthenticationException(ExceptionStatus.JWT_EXPIRED);
		} catch (JwtException e) {
			throw new CustomAuthenticationException(ExceptionStatus.JWT_INVALID);
		} catch (Exception e) {
			throw new CustomAuthenticationException(ExceptionStatus.AUTHENTICATION_FAILED);
		}
	}

	public void processAuthentication(HttpServletRequest request, HttpServletResponse response,
			OauthResult user, String provider) {
		TokenDto tokens = tokenProvider.createTokens(
				user.getUserId(),
				user.getRoles(),
				provider
		);
		cookieManager.setTokenCookies(response, tokens, request.getServerName());

		Authentication auth = createAuthenticationForUser(user, provider);
		SecurityContextHolder.getContext().setAuthentication(auth);
	}

	public Authentication createAuthenticationForUser(OauthResult user, String provider) {
		Map<String, Object> attribute = new HashMap<>();
		attribute.put("email", user.getEmail());
		attribute.put("roles", user.getRoles());
		attribute.put("blackholedAt", user.getBlackHoledAt());

		List<String> roles = List.of(user.getRoles().split(FtRole.DELIMITER));

		List<GrantedAuthority> authorityList = roles.stream()
				.map(role -> new SimpleGrantedAuthority(FtRole.ROLE + role))
				.collect(Collectors.toList());

		CustomOauth2User oAuth2User = new CustomOauth2User(provider, user.getName(), attribute,
				authorityList);
		return new UsernamePasswordAuthenticationToken(oAuth2User, null, authorityList);
	}
}
