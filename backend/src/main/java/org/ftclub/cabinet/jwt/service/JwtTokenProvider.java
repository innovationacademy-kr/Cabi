package org.ftclub.cabinet.jwt.service;

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
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.admin.admin.service.AdminQueryService;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.jwt.domain.JwtTokenProperties;
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
	private final AdminQueryService adminQueryService;

	/**
	 * 토큰을 복호화하고, 예외 발생 시 호출자가 처리하도록 합니다.
	 *
	 * @param token
	 * @return
	 */
	public Claims parseValidToken(String token) {
		Key key = jwtTokenProperties.getSigningKey();
		try {
			return Jwts.parserBuilder()
					.setSigningKey(key).build()
					.parseClaimsJws(token)
					.getBody();
		} catch (ExpiredJwtException e) {
			log.error("만료된 JWT 토큰입니다: {}", e.getMessage());
			throw e; // 그대로 던져서 호출자가 처리하도록 함
		} catch (JwtException e) {
			log.error("유효하지 않은 JWT 토큰입니다: {}", e.getMessage());
			throw e; // 그대로 던져서 호출자가 처리하도록 함
		}
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

	/**
	 * access, refresh Token을 생성합니다.
	 *
	 * @param userId
	 * @param roles
	 * @param provider
	 * @return
	 */
	public TokenDto createTokens(Long userId, String roles, String provider) {
		Claims claims = Jwts.claims();
		claims.put(JwtTokenConstants.USER_ID, userId);
		claims.put(JwtTokenConstants.ROLES, roles);
		claims.put(JwtTokenConstants.OAUTH, provider);

		String accessToken = createToken(claims, jwtTokenProperties.getAccessExpiryMillis());
		String refreshToken = createToken(claims, jwtTokenProperties.getRefreshExpiryMillis());

		return new TokenDto(accessToken, refreshToken);
	}

	/**
	 * AGU 유저 토큰을 생성합니다.
	 *
	 * @param userId
	 * @return
	 */
	public String createAGUToken(Long userId) {
		Date now = new Date();
		return Jwts.builder()
				.claim(JwtTokenConstants.USER_ID, userId)
				.claim(JwtTokenConstants.ROLES, FtRole.AGU.name())
				.claim(JwtTokenConstants.OAUTH, "Temporary")
				.setExpiration(new Date(now.getTime() + jwtTokenProperties.getAccessExpiryMillis()))
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
	 * 사용된 토큰(만료 access, 발급 1회 역할 다한 refresh)은 redis로 blackList에 추가
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
			parseValidToken(accessToken);

			throw ExceptionStatus.JWT_NOT_EXPIRED.asServiceException();
		} catch (ExpiredJwtException e) {
			// refreshToken parse 도중 예외 발생 시 serviceException 반환
			Claims claims = parseValidToken(refreshToken);
			Long userId = claims.get(JwtTokenConstants.USER_ID, Long.class);
			String roles = claims.get(JwtTokenConstants.ROLES, String.class);
			String provider = claims.get(JwtTokenConstants.OAUTH, String.class);

			if (roles.contains(AdminRole.ADMIN.name())) {
				Admin admin = adminQueryService.getById(userId);

				if (jwtRedisService.isUsedAccessToken(admin.getId(), accessToken)
						|| jwtRedisService.isUsedRefreshToken(admin.getId(), refreshToken)) {
					throw ExceptionStatus.JWT_ALREADY_USED.asServiceException();
				}

				TokenDto tokenDto = createTokens(admin.getId(), admin.getRole().name(), provider);

				// cookie 업데이트 로직 추가
				cookieManager.setTokenCookies(response, tokenDto, request.getServerName());

				// access, refresh blackList 추가
				jwtRedisService.addUsedTokens(admin.getId(), accessToken, refreshToken);

				return tokenDto;
			}
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
