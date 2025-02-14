package org.ftclub.cabinet.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.Key;
import java.util.Date;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtTokenProvider {

	public static final Long refreshTokenValidMillisecond = 30 * 24 * 60 * 60 * 1000L; // 30일
	private static final String BEARER = "Bearer ";
	private final JwtProperties jwtProperties;
	private final Long accessTokenValidMillisecond = 60 * 60 * 1000L; // 1시간
	@Value("${cabinet.jwt.jwt-secret-key}")
	private String secretKey;


	public Claims parseToken(String accessToken) {
		byte[] secretKeyBytes = DatatypeConverter.parseBase64Binary(secretKey);
		Key key = new SecretKeySpec(secretKeyBytes, SignatureAlgorithm.HS256.getJcaName());

		return Jwts.parserBuilder()
				.setSigningKey(key).build()
				.parseClaimsJws(accessToken)
				.getBody();
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
		Claims claims = Jwts.claims().setSubject(String.valueOf(userId));
		claims.put("roles", roles);
		Date now = new Date();

		String accessToken = Jwts.builder()
				.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
				.setClaims(claims)
				.setIssuedAt(now)
				.setExpiration(new Date(now.getTime() + accessTokenValidMillisecond))
				.signWith(jwtProperties.getSigningKey(), SignatureAlgorithm.HS256)
				.compact();

		String refreshToken = Jwts.builder()
				.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
				.setClaims(claims)
				.setIssuedAt(now)
				.setExpiration(new Date(now.getTime() + refreshTokenValidMillisecond))
				.signWith(jwtProperties.getSigningKey(), SignatureAlgorithm.HS256)
				.compact();

		return new TokenDto(accessToken, refreshToken);
	}
}
