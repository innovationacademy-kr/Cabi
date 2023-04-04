package org.ftclub.cabinet.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Date;

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
	public static String createToken(String subject, AdminProfileDto profile) {
		//error handling for expiry
		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS512;

		byte[] secretKeyBytes = DatatypeConverter.parseBase64Binary(SECRET);
		Key signingKey = new SecretKeySpec(secretKeyBytes, signatureAlgorithm.getJcaName());

		return Jwts.builder()
				.setSubject(subject)
				.signWith(signingKey, signatureAlgorithm)
				.setExpiration(new Date(System.currentTimeMillis()))
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
