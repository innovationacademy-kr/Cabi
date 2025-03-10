package org.ftclub.cabinet.jwt.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import java.security.Key;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.jwt.domain.JwtTokenProperties;
import org.springframework.stereotype.Service;

/**
 * Jwt 생성 및 파싱 담당
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class JwtProvider {

	private final JwtTokenProperties tokenProperties;

	/**
	 * 토큰을 복호화하고, 예외 발생 시 호출자에서 처리합니다.
	 *
	 * @param token 검증할 JWT
	 * @return Claims 객체 {@link Claims}
	 */
	public Claims parseToken(String token) {
		Key key = tokenProperties.getSigningKey();

		try {
			return Jwts.parserBuilder()
					.setSigningKey(key).build()
					.parseClaimsJws(token)
					.getBody();
		} catch (ExpiredJwtException e) {
			log.info("만료된 JWT 입니다 : {}", e.getMessage());
			throw e;
		} catch (JwtException e) {
			log.info("유효하지 않은 JWT 입니다 : {}", e.getMessage());
			throw e;
		}
	}


	public TokenDto createAccessAndRefreshToken(Long userId, String roles, String provider) {
		String accessToken = createToken(userId, roles, provider,
				tokenProperties.getAccessExpiryMillis());
		String refreshToken = createToken(userId, roles, provider,
				tokenProperties.getRefreshExpiryMillis());

		return new TokenDto(accessToken, refreshToken);
	}

	public String createAguToken(Long userId) {
		Date now = new Date();
		
		return Jwts.builder()
				.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
				.claim(JwtTokenConstants.USER_ID, userId)
				.claim(JwtTokenConstants.ROLES, "AGU")
				.claim(JwtTokenConstants.OAUTH, "Temporary")
				.setExpiration(new Date(now.getTime() + tokenProperties.getAccessExpiryMillis()))
				.signWith(tokenProperties.getSigningKey())
				.compact();
	}

	private String createToken(Long userId, String roles, String provider, Long validity) {
		Date now = new Date();

		return Jwts.builder()
				.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
				.claim(JwtTokenConstants.USER_ID, userId)
				.claim(JwtTokenConstants.ROLES, roles)
				.claim(JwtTokenConstants.OAUTH, provider)
				.setExpiration(new Date(now.getTime() + validity))
				.signWith(tokenProperties.getSigningKey())
				.compact();
	}

}
