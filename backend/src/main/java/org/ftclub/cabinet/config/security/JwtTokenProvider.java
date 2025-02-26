package org.ftclub.cabinet.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.Key;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.service.JwtRedisService;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtTokenProvider {

	private final UserQueryService userQueryService;
	private final CookieManager cookieManager;
	private final JwtRedisService jwtRedisService;
	private final JwtTokenProperties jwtTokenProperties;

	/**
	 * 1. parse Token Exception 발생 시 FE에게 어떻게 전달할 것인가?
	 * <p>
	 * 2. 위치에 따라 발생하는 exception 관리를 어떻게 할까?
	 *
	 * @param accessToken
	 * @return
	 */
	public Claims parseToken(String accessToken) {
		Key key = jwtTokenProperties.getSigningKey();

		return Jwts.parserBuilder()
				.setSigningKey(key).build()
				.parseClaimsJws(accessToken)
				.getBody();
	}

	/**
	 * 헤더로부터 JWT가 있는지 확인합니다.
	 *
	 * @param request
	 * @return
	 */
	public String extractToken(HttpServletRequest request) {
		String header = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (header == null || !header.startsWith(JwtTokenConstants.BEARER)) {
			return null;
		}
		return header.substring(JwtTokenConstants.BEARER.length());
	}

	public TokenDto createTokens(Long userId, String roles, String provider) {
		Claims claims = Jwts.claims();
		claims.put(JwtTokenConstants.USER_ID, userId);
		claims.put(JwtTokenConstants.ROLES, roles);
		claims.put(JwtTokenConstants.OAUTH, provider);

		String accessToken = createToken(claims, jwtTokenProperties.getAccessExpiryMillis());
		String refreshToken = createToken(claims, jwtTokenProperties.getRefreshExpiryMillis());

		return new TokenDto(accessToken, refreshToken);
	}

	public String createAGUToken(Long userId) {
		return Jwts.builder()
				.claim(JwtTokenConstants.USER_ID, userId)
				.claim(JwtTokenConstants.ROLES, FtRole.AGU.name())
				.claim(JwtTokenConstants.OAUTH, "Temporary")
				.setExpiration(new Date(System.currentTimeMillis() + 10 * 60 * 1000)) // 10분
				.signWith(jwtTokenProperties.getSigningKey())
				.compact();
	}


	private String createToken(Claims claims, Long validity) {
		Date now = new Date();

		return Jwts.builder()
				.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
				.setClaims(claims)
				.setIssuedAt(now)
				.setExpiration(new Date(now.getTime() + validity))
				.signWith(jwtTokenProperties.getSigningKey(), SignatureAlgorithm.HS256)
				.compact();
	}

	/**
	 * accessToken이 만료되었는지 확인
	 * <p>
	 * 사용된 토큰은 redis로 blackList에 추가
	 * <p>
	 * 쿠키 업데이트
	 *
	 * @param response
	 * @return
	 */

	public TokenDto reissueToken(HttpServletRequest request,
			HttpServletResponse response,
			String refreshToken) {

		String accessToken = extractToken(request);
		if (accessToken == null) {
			throw ExceptionStatus.JWT_TOKEN_NOT_FOUND.asServiceException();
		}
		
		try {
			parseToken(accessToken);

			throw ExceptionStatus.JWT_NOT_EXPIRED.asServiceException();
		} catch (ExpiredJwtException e) {
			Claims claims = parseToken(refreshToken);
			String provider = claims.get(JwtTokenConstants.OAUTH, String.class);
			Long userId = claims.get(JwtTokenConstants.USER_ID, Long.class);
			User user = userQueryService.getUser(userId);

			// 이미 사용된 토큰인지 검수
			if (jwtRedisService.isUsedAccessToken(user.getId(), accessToken)
					|| jwtRedisService.isUsedRefreshToken(userId, refreshToken)) {
				throw ExceptionStatus.JWT_ALREADY_USED.asServiceException();
			}
			// 토큰 생성
			TokenDto tokenDto = createTokens(user.getId(), user.getRoles(), provider);

			// cookie 업데이트 로직 추가
			cookieManager.setTokenCookies(response, tokenDto, request.getServerName());

			// access, refresh blackList 추가
			jwtRedisService.addUsedTokens(user.getId(), accessToken, refreshToken);

			return tokenDto;
		} catch (JwtException e) {
			throw ExceptionStatus.JWT_EXCEPTION.asServiceException();
		}

	}
}
