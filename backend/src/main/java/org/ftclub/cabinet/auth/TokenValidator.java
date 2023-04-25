package org.ftclub.cabinet.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.JwtProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.xml.bind.DatatypeConverter;

@Component
@RequiredArgsConstructor
public class TokenValidator {

	@Autowired
	private final JwtProperties jwtProperties;
	public Boolean isMainTokenValid(String token) {
		if (isTokenExpired(token) == false) {
			System.out.printf("token subject = %s\n", getSubject(token));
			return true;
		}
		return false;
	}

	public Boolean isAdminTokenValid(String token) {
		if (isTokenExpired(token) == false) {
			System.out.printf("token subject = %s\n", getSubject(token));
			return true;
		}
		return false;
	}

	public String getSubject(String token) {
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(DatatypeConverter.parseBase64Binary(jwtProperties.getSecret()))
				.build()
				.parseClaimsJws(token)
				.getBody();
		return claims.getSubject();
	}

	public Boolean isTokenExpired(String token) {
		System.out.printf("token = %s\n", token);
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(DatatypeConverter.parseBase64Binary(jwtProperties.getSecret()))
				.build()
				.parseClaimsJws(token)
				.getBody();
		System.out.printf("body = %s\n", claims.toString());
		return claims.getExpiration().before(new java.util.Date());
	}
}
