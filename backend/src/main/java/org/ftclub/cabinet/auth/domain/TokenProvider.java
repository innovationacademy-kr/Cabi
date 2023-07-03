package org.ftclub.cabinet.auth.domain;

import com.fasterxml.jackson.databind.JsonNode;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.config.MasterProperties;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.ftclub.cabinet.exception.ExceptionStatus.INVALID_ARGUMENT;
import static org.ftclub.cabinet.exception.ExceptionStatus.UNAUTHORIZED_USER;

/**
 * API 제공자에 따라 JWT 토큰을 생성하는 클래스입니다.
 */
@Component
@RequiredArgsConstructor
public class TokenProvider {

	private final JwtProperties jwtProperties;
	private final GoogleApiProperties googleApiProperties;
	private final FtApiProperties ftApiProperties;
	private final MasterProperties masterProperties;

	/**
	 * 토큰을 발급하기 전에 특정 국가의 유저인지 (현재는 42서울) 검증합니다.
	 *
	 * @param email  42 email
	 * @param nation 검증하고자 하는 국가 도메인
	 * @return boolean
	 */
	public boolean isValidNationalEmail(String email, String nation) {
		return email.endsWith("." + nation);
	}

	/**
	 * JWT 토큰에 담을 클레임(Payload)을 생성합니다.
	 *
	 * @param provider API 제공자 이름
	 * @param profile  API 제공자로부터 받은 프로필
	 * @return JWT 클레임(Payload)
	 */
	public Map<String, Object> makeClaimsByProviderProfile(String provider, JsonNode profile) {
		Map<String, Object> claims = new HashMap<>();
		if (provider.equals(googleApiProperties.getProviderName())) {
			claims.put("email", profile.get("email").asText());
		}
		if (provider.equals(ftApiProperties.getProviderName())) {
			String email = profile.get("email").asText();
			if (!isValidNationalEmail(email, "kr")) {
				throw new DomainException(UNAUTHORIZED_USER);
			}
			claims.put("email", email);
			claims.put("name", profile.get("login").asText());
			JsonNode blackholedAt = profile.get("cursus_users").get(1).get("blackholed_at");
			if (blackholedAt.equals(null) || blackholedAt.asText().equals("null")) {
				claims.put("blackholedAt", null);
			} else {
				claims.put("blackholedAt", DateUtil.stringToDate(blackholedAt.asText().substring(0, 10)));
			}
			claims.put("role", UserRole.USER);
		}
		return claims;
	}

	/**
	 * JWT 토큰을 생성합니다.
	 *
	 * @param claims 토큰에 담길 페이로드
	 * @param now    현재 시각
	 * @return JWT 토큰
	 */
	public String createToken(Map<String, Object> claims, LocalDateTime now) {
		return Jwts.builder()
				.setClaims(claims)
				.signWith(jwtProperties.getSigningKey(), SignatureAlgorithm.HS256)
				.setExpiration(DateUtil.toDate(now.plusDays(jwtProperties.getExpiryDays())))
				.compact();
	}

	public String createMasterToken(LocalDateTime now) {
		return Jwts.builder()
				.setClaims(makeMasterClaims())
				.signWith(jwtProperties.getSigningKey(), SignatureAlgorithm.HS256)
				.setExpiration(DateUtil.toDate(now.plusDays(jwtProperties.getExpiryDays())))
				.compact();
	}

	private Map<String, Object> makeMasterClaims() {
		Map<String, Object> claims = new HashMap<>();
		claims.put("email", masterProperties.getEmail());
		claims.put("role", AdminRole.MASTER);
		return claims;
	}

	public String getTokenNameByProvider(String providerName) {
		if (providerName.equals(jwtProperties.getAdminProviderName())) {
			return jwtProperties.getAdminTokenName();
		}
		if (providerName.equals(jwtProperties.getMainProviderName())) {
			return jwtProperties.getMainTokenName();
		}
		throw new DomainException(INVALID_ARGUMENT);
	}
}
