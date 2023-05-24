package org.ftclub.cabinet.auth.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import java.util.Base64;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.config.JwtProperties;
import org.springframework.stereotype.Component;

/**
 * 토큰의 유효성을 검사하는 클래스입니다.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TokenValidator {

	private final JwtProperties jwtProperties;

	/**
	 * 토큰의 유효성을 검사합니다.
	 * <br>
	 * 매 요청시 헤더에 Bearer 토큰으로 인증을 시도하기 때문에,
	 * <br>
	 * 헤더에 bearer 방식으로 유효하게 토큰이 전달되었는지 검사합니다.
	 *
	 * @param req {@link HttpServletRequest}
	 * @return 정상적인 방식의 토큰 요청인지, 유효한 토큰인지 여부
	 */
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

	/**
	 * 토큰의 유효성을 검사합니다.
	 * <br>
	 * JWT ParseBuilder의 parseClaimJws를 통해 토큰을 검사합니다.
	 * <br>
	 * 만료되었거나, 잘못된(위, 변조된) 토큰이거스나, 지원되지 않는 토큰이면 false를 반환합니다.
	 *
	 * @param token 검사할 토큰
	 * @return 토큰이 만료되거나 유효한지 아닌지 여부
	 */
	public Boolean checkTokenValidity(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(jwtProperties.getSigningKey()).build()
					.parseClaimsJws(token);
			return true;
		} catch (MalformedJwtException e) {
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

	public JsonNode getPayloadJson(final String token) throws JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		final String payloadJWT = token.split("\\.")[1];
		Base64.Decoder decoder = Base64.getUrlDecoder();

		return objectMapper.readTree(new String(decoder.decode(payloadJWT)));
	}
}
