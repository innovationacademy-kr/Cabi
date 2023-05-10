package org.ftclub.cabinet.auth;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import java.util.Base64;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.config.JwtProperties;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TokenValidator {

	private final JwtProperties jwtProperties;

	public Boolean isTokenValid(HttpServletRequest req) {
		String authHeader = req.getHeader("Authorization");
		if (authHeader == null || authHeader.startsWith("Bearer ") == false) {
			return false;
		}
		String token = authHeader.substring(7);
		if (token == null || checkTokenValidity(token) == false) {
			return false;
		}
		return true;
	}

	public Boolean checkTokenValidity(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(jwtProperties.getSigningKey()).build()
					.parseClaimsJws(token);
			return true;
		} catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
			log.info("잘못된 JWT 서명입니다.");
		} catch (ExpiredJwtException e) {
			log.info("만료된 JWT 토큰입니다.");
		} catch (UnsupportedJwtException e) {
			log.info("지원되지 않는 JWT 토큰입니다.");
		} catch (IllegalArgumentException e) {
			log.info("JWT 토큰이 잘못되었습니다.");
		}
		return false;
	}

	public JSONObject getPayloadJson(final String token) {
		final String payloadJWT = token.split("\\.")[1];
		Base64.Decoder decoder = Base64.getUrlDecoder();

		final String payload = new String(decoder.decode(payloadJWT));
		return new JSONObject(payload);
	}
}
