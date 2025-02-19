package org.ftclub.cabinet.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtTokenProvider {

	public static final Long accessTokenValidMillisecond = 60 * 60 * 1000L; // 1시간
	private static final String BEARER = "Bearer ";
	public final Long refreshTokenValidMillisecond = 30 * 24 * 60 * 60 * 1000L; // 30일
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
			throw new CustomAuthenticationException(ExceptionStatus.JWT_TOKEN_NOT_FOUND);
		}
		return header.substring(BEARER.length());
	}

	public TokenDto createTokenDto(Long userId, String roles) {

		String accessToken = createToken(userId, roles, accessTokenValidMillisecond);
		String refreshToken = createToken(userId, roles, refreshTokenValidMillisecond);

		return new TokenDto(accessToken, refreshToken);
	}

	private String createToken(Long userId, String roles, Long validity) {
		Claims claims = Jwts.claims();
		claims.put("userId", userId);
		claims.put("roles", roles);
		Date now = new Date();

		return Jwts.builder()
				.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
				.setClaims(claims)
				.setIssuedAt(now)
				.setExpiration(new Date(now.getTime() + validity))
				.signWith(signingKey, SignatureAlgorithm.HS256)
				.compact();
	}
}
