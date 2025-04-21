package org.ftclub.cabinet.jwt.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import java.security.Key;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.dto.TokenDto;
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

		return Jwts.parserBuilder()
				.setSigningKey(key).build()
				.parseClaimsJws(token)
				.getBody();
	}


	public TokenDto createAccessAndRefreshToken(Claims claims) {
		String accessToken = createToken(claims, tokenProperties.getAccessExpiryMillis());
		String refreshToken = createToken(claims, tokenProperties.getRefreshExpiryMillis());

		return new TokenDto(accessToken, refreshToken);
	}

	public String createAguToken(Claims claims) {
		Date now = new Date();

		return Jwts.builder()
				.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
				.setClaims(claims)
				.setExpiration(new Date(now.getTime() + tokenProperties.getAccessExpiryMillis()))
				.signWith(tokenProperties.getSigningKey())
				.compact();
	}

	public String createToken(Claims claims, Long validity) {
		Date now = new Date();

		return Jwts.builder()
				.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
				.setClaims(claims)
				.setExpiration(new Date(now.getTime() + validity))
				.signWith(tokenProperties.getSigningKey())
				.compact();
	}

}
