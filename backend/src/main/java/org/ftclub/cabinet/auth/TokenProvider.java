package org.ftclub.cabinet.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.utils.DateUtil;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TokenProvider {

	private final JwtProperties jwtProperties;

	private final GoogleApiProperties googleApiProperties;

	private final FtApiProperties ftApiProperties;

	public Map<String, Object> makeClaims(String provider, JSONObject profile) {
		Map<String, Object> claims = new HashMap<>();
		if (provider == googleApiProperties.getName()) {
			claims.put("email", profile.get("email").toString());
		}
		if (provider == ftApiProperties.getName()) {
			claims.put("name", profile.get("login").toString());
			claims.put("email", profile.get("email").toString());
			claims.put("blackholedAt", profile.getJSONArray("cursus_users")
					.getJSONObject(1)
					.get("blackholed_at"));
			claims.put("role", UserRole.USER);
		}
		return claims;
	}

	public String createToken(String provider, JSONObject profile, Date now) {
		return Jwts.builder()
				.setClaims(makeClaims(provider, profile))
				.signWith(jwtProperties.getSigningKey(), SignatureAlgorithm.HS256)
				.setExpiration(DateUtil.addDaysToDate(now, jwtProperties.getExpiry()))
				.compact();
	}


}
