package org.ftclub.cabinet.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.config.MasterProperties;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Component;

/**
 * API 제공자에 따라 JWT 토큰을 생성하는 클래스입니다.
 */
@Component
@RequiredArgsConstructor
public class TokenProvider {

	public static final String USER_TOKEN_NAME = "access_token";
	public static final String ADMIN_TOKEN_NAME = "admin_access_token";
	private final JwtProperties jwtProperties;
	private final MasterProperties masterProperties;

	/**
	 * JWT 토큰을 생성합니다.
	 *
	 * @param user 유저
	 * @param now  현재 시각
	 * @return JWT 토큰
	 */
	public String createUserToken(User user, LocalDateTime now) {
		Claims claims = Jwts.claims();
		claims.put("email", user.getEmail());
		claims.put("name", user.getName());
		claims.put("blackholedAt", user.getBlackholedAtString());
		claims.put("role", user.getRoles());

		return Jwts.builder()
				.setClaims(claims)
				.signWith(jwtProperties.getSigningKey(), SignatureAlgorithm.HS256)
				.setExpiration(Timestamp.valueOf(now.plusDays(jwtProperties.getExpiryDays())))
				.compact();
	}

	/**
	 * security의 Oauth2 로그인 성공 시, 발급되는 JWT
	 *
	 * @param user     유저
	 * @param provider oauth 로그인 위치
	 * @param now      발급 시각(현재)
	 * @return
	 */
	public String createUserToken(User user, String provider, LocalDateTime now) {
		Claims claims = Jwts.claims();
		claims.put("provider", provider);
		claims.put("userId", user.getId());
		claims.put("email", user.getEmail());
		claims.put("name", user.getName());
		claims.put("blackholedAt", user.getBlackholedAtString());
		claims.put("roles", user.getRoles());

		return Jwts.builder()
				.setClaims(claims)
				.signWith(jwtProperties.getSigningKey(), SignatureAlgorithm.HS256)
				.setExpiration(Timestamp.valueOf(now.plusDays(jwtProperties.getExpiryDays())))
				.compact();
	}

	/**
	 * JWT 토큰을 생성합니다.
	 *
	 * @param admin 관리자
	 * @param now   현재 시각
	 * @return JWT 토큰
	 */
	public String createAdminToken(Admin admin, LocalDateTime now) {
		Claims claims = Jwts.claims();
		claims.put("email", admin.getEmail());
		claims.put("role", admin.getRole());
		return Jwts.builder()
				.setClaims(claims)
				.signWith(jwtProperties.getSigningKey(), SignatureAlgorithm.HS256)
				.setExpiration(Timestamp.valueOf(now.plusDays(jwtProperties.getExpiryDays())))
				.compact();
	}


}
