package org.ftclub.cabinet.auth.domain;

import com.fasterxml.jackson.databind.JsonNode;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Component;

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

	/**
	 * 토큰을 발급하기 전에 특정 국가의 유저인지 (현재는 42서울) 검증합니다.
	 *
	 * @param email 42 email
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
			if (!isValidNationalEmail(email, "kr"))
				throw new ServiceException(UNAUTHORIZED_USER);
			claims.put("email", email);
			claims.put("name", profile.get("login").asText());
			claims.put("blackholedAt",
					profile.get("cursus_users").get(1).get("blackholed_at") != null ?
							profile.get("cursus_users").get(1).get("blackholed_at").asText()
							: null);
			claims.put("role", UserRole.USER);
		}
		return claims;
	}

	/**
	 * JWT 토큰을 생성합니다.
	 *
	 * @param provider API 제공자 이름
	 * @param profile  API 제공자로부터 받은 프로필
	 * @param now      현재 시각
	 * @return JWT 토큰
	 */
	public String createToken(String provider, JsonNode profile, Date now) {
		return Jwts.builder()
				.setClaims(makeClaimsByProviderProfile(provider, profile))
				.signWith(jwtProperties.getSigningKey(), SignatureAlgorithm.HS256)
				.setExpiration(DateUtil.addDaysToDate(now, jwtProperties.getExpiry()))
				.compact();
	}
}
