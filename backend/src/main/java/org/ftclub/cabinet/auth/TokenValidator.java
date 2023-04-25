package org.ftclub.cabinet.auth;

import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpServerErrorException;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;

@Component
@RequiredArgsConstructor
public class TokenValidator {

	@Autowired
	private final JwtProperties jwtProperties;

	@Autowired
	private final CookieManager cookieManager;

	public Boolean isTokenValid(HttpServletRequest req, String tokenName) {
		 String authHeader = req.getHeader("Authorization");
		 if (authHeader == null
		 ||	authHeader.startsWith("Bearer ") == false) {
			 System.out.printf("%s is invalid!\n", tokenName);
			 return false;
		 }
		String token = authHeader.substring(7);
		if (token == null || checkTokenValidity(token) == true) {
			System.out.printf("%s is invalid!\n", tokenName);
			return false;
		}
		System.out.printf("%s is valid!\n", tokenName);
		return true;
	}

	public Boolean checkTokenValidity(String token) {
		try {
			return  Jwts.parserBuilder()
					.setSigningKey(DatatypeConverter.parseBase64Binary(jwtProperties.getSecret()))
					.build()
					.parseClaimsJws(token)
					.getBody()
					.getExpiration()
					.before(new java.util.Date());
		} catch (Exception e) {
			throw new ServiceException(ExceptionStatus.UNAUTHORIZED);
		}
	}
}
