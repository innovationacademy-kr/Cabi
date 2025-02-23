package org.ftclub.cabinet.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.service.JwtRedisService;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtTokenProvider {

	public static final String ACCESS_TOKEN = "access_token";
	public static final String REFRESH_TOKEN = "refresh_token";
	public static final Long accessTokenValidMillisecond = 60 * 60 * 1000L; // 1시간
	public static final Long refreshTokenValidMillisecond = 30 * 24 * 60 * 60 * 1000L; // 30일
	public static final String OAUTH = "oauth";
	public static final String USER_ID = "userId";
	public static final String ROLES = "roles";
	private static final String BEARER = "Bearer ";
	private final UserQueryService userQueryService;
	private final CookieManager cookieManager;
	private final JwtRedisService jwtRedisService;
	private Key signingKey;
	private String secretKey;

	@Value("${cabinet.jwt.jwt-secret-key}")
	public void setSecretKey(String secretKey) {
		this.secretKey = secretKey;
		this.signingKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
	}

	public Claims parseToken(String accessToken) {
		Key key = generateKeyBySecret(secretKey);

		return Jwts.parserBuilder()
				.setSigningKey(key).build()
				.parseClaimsJws(accessToken)
				.getBody();
	}

	private Key generateKeyBySecret(String secret) {
		return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}

	/**
	 * 헤더로부터 JWT가 있는지 검증합니다.
	 * <p>
	 * 추후 전체 공개 페이지가 있다면(공지사항 등..?) 예외처리 안하고 null 반환
	 *
	 * @param request
	 * @return
	 */
	public String extractToken(HttpServletRequest request) {
		String header = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (header == null || !header.startsWith(BEARER)) {
			return null;
		}
		return header.substring(BEARER.length());
	}

	public TokenDto createTokens(Long userId, String roles, String provider) {
		Claims claims = Jwts.claims();
		claims.put(USER_ID, userId);
		claims.put(ROLES, roles);
		claims.put(OAUTH, provider);

		String accessToken = createToken(claims, accessTokenValidMillisecond);
		String refreshToken = createToken(claims, refreshTokenValidMillisecond);

		return new TokenDto(accessToken, refreshToken);
	}


	private String createToken(Claims claims, Long validity) {
		Date now = new Date();

		return Jwts.builder()
				.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
				.setClaims(claims)
				.setIssuedAt(now)
				.setExpiration(new Date(now.getTime() + validity))
				.signWith(signingKey, SignatureAlgorithm.HS256)
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
	 * @param tokenDto
	 * @return
	 */

	public TokenDto reissueToken(HttpServletRequest request,
			HttpServletResponse response,
			String refreshToken) {

		String accessToken = extractToken(request);
		// 만료 토큰이 아니면 에러
		try {
			parseToken(accessToken);

			throw ExceptionStatus.JWT_NOT_EXPIRED.asServiceException();
		} catch (ExpiredJwtException e) {
			Claims claims = e.getClaims();
			String provider = claims.get(OAUTH, String.class);
			Long userId = claims.get(USER_ID, Long.class);
			User user = userQueryService.getUser(userId);

			// 이미 사용된 토큰인지 검수
			if (jwtRedisService.isUsedAccessToken(user.getId(), accessToken)
					|| jwtRedisService.isUsedRefreshToken(userId, refreshToken)) {
				throw ExceptionStatus.JWT_ALREADY_USED.asServiceException();
			}
			// 토큰 생성
			TokenDto tokenDto = createTokens(user.getId(), user.getRoles(), provider);

			// cookie 업데이트 로직 추가
			Cookie accessCookie = cookieManager.cookieOf(ACCESS_TOKEN, tokenDto.getAccessToken());
			Cookie refreshCookie = cookieManager.cookieOf(REFRESH_TOKEN,
					tokenDto.getRefreshToken());
			cookieManager.setCookieToClient(response, accessCookie, "/", request.getServerName());
			cookieManager.setCookieToClient(response, refreshCookie, "/", request.getServerName());

			// access, refresh blackList 추가
			jwtRedisService.addUsedTokens(user.getId(), accessToken, refreshToken);

			return tokenDto;
		}
	}
}
