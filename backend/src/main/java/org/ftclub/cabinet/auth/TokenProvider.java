package org.ftclub.cabinet.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.user.domain.UserRole;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class TokenProvider {

	@Autowired
	private final JwtProperties jwtProperties;

	@Autowired
	private final GoogleApiProperties googleApiProperties;

	@Autowired
	private final FtApiProperties ftApiProperties;
	public Map<String, Object> makeClaims(String provider, JSONObject profile) {
		Map<String, Object> claims = new HashMap<>();
		if (provider == googleApiProperties.getName()) {
			claims.put("email", profile.get("email").toString());
		}
		if (provider == ftApiProperties.getName()) {
			claims.put("intra_id", profile.get("login").toString());
			claims.put("email", profile.get("email").toString());
			claims.put("blackholed_at", profile.getJSONArray("cursus_users")
												.getJSONObject(1)
												.get("blackholed_at"));
			claims.put("role", UserRole.USER);
		}
		return claims;
	}

	public String createToken(String provider, JSONObject profile) {
		//error handling for expiry
		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

		byte[] secretKeyBytes = DatatypeConverter.parseBase64Binary(jwtProperties.getSecret());
		Key signingKey = new SecretKeySpec(secretKeyBytes, signatureAlgorithm.getJcaName());

		return Jwts.builder()
				.setClaims(makeClaims(provider, profile))
				.signWith(signingKey, signatureAlgorithm)
				.setExpiration(new Date(System.currentTimeMillis() + (1000 * 60 * 60 * jwtProperties.getExpiry())))
				.compact();
	}



}
