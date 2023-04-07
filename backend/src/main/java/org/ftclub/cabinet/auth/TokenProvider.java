package org.ftclub.cabinet.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.ftclub.cabinet.user.domain.UserRole;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class TokenProvider {
	private static final String SECRET = "my_secretisverylongmy_secretisverylongmy_secretisverylongmy_secretisverylongmy_secretisverylongmy_secretisverylongmy_secretisverylongmy_secretisverylongmy_secretisverylong";

//	public static String creatToken(String subject, long expiry) {
//		//error handling for expiry
//		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS512;
//
//		byte[] secretKeyBytes = DatatypeConverter.parseBase64Binary(SECRET);
//		Key signingKey = new SecretKeySpec(secretKeyBytes, signatureAlgorithm.getJcaName());
//
//		return Jwts.builder()
//				.setSubject(subject)
//				.signWith(signingKey, signatureAlgorithm)
//				.setExpiration(new Date(System.currentTimeMillis() + expiry))
//				.compact();
//	}
	public static Map<String, Object> makeClaims(String provider, JSONObject profile) {
		Map<String, Object> claims = new HashMap<>();
		if (provider == "google") {
			claims.put("email", profile.get("email").toString());
		}
		if (provider == "ft") {
			claims.put("intra_id", profile.get("login").toString());
			claims.put("email", profile.get("email").toString());
			claims.put("blackholed_at", profile.getJSONArray("cursus_users")
												.getJSONObject(1)
												.get("blackholed_at"));
			claims.put("role", UserRole.USER);
		}
		return claims;
	}

	public static String createToken(String provider, JSONObject profile) {
		//error handling for expiry
		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

		byte[] secretKeyBytes = DatatypeConverter.parseBase64Binary(SECRET);
		Key signingKey = new SecretKeySpec(secretKeyBytes, signatureAlgorithm.getJcaName());

		return Jwts.builder()
				.setClaims(makeClaims(provider, profile))
				.signWith(signingKey, signatureAlgorithm)
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
				.compact();
	}

	public static String getSubject(String token) {
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(DatatypeConverter.parseBase64Binary((SECRET)))
				.build()
				.parseClaimsJws(token)
				.getBody();
		return claims.getSubject();
	}


}
