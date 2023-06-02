package org.ftclub.cabinet.auth.domain;

import static org.ftclub.cabinet.auth.domain.AuthLevel.USER_ONLY;

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
import org.ftclub.cabinet.config.DomainNameProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.config.MasterProperties;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.service.UserService;
import org.springframework.stereotype.Component;

/**
 * 토큰의 유효성을 검사하는 클래스입니다.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TokenValidator {

	private final MasterProperties masterProperties;
	private final DomainNameProperties domainNameProperties;
	private final JwtProperties jwtProperties;
	private final UserService userService;

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
	public Boolean isTokenValid(HttpServletRequest req, AuthLevel authLevel)
			throws JsonProcessingException {
		String authHeader = req.getHeader("Authorization");
		if (authHeader == null || authHeader.startsWith("Bearer ") == false) {
			return false;
		}
		String token = authHeader.substring(7);
		if (token == null || checkTokenValidity(token) == false) {
			return false;
		}
		return checkRole(token, authLevel);
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

	/**
	 * 토큰의 Payload를 JsonNode(JSON) 형식으로 가져옵니다.
	 *
	 * @param token 토큰
	 * @return JSON 형식의 Payload
	 * @throws JsonProcessingException
	 */
	public JsonNode getPayloadJson(final String token) throws JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		final String payloadJWT = token.split("\\.")[1];
		Base64.Decoder decoder = Base64.getUrlDecoder();

		return objectMapper.readTree(new String(decoder.decode(payloadJWT)));
	}

	/**
	 * 해당 토큰의 페이로드 정보가 인증 단계에 알맞는지 확인합니다.
	 * <p>
	 * USER_ONLY의 경우 검증하지 않습니다.
	 *
	 * @param token     토큰
	 * @param authLevel 인증 단계
	 * @return 페이로드 정보가 실제 DB와 일치하면 true를 반환합니다.
	 */
	private boolean checkRole(String token, AuthLevel authLevel) throws JsonProcessingException {
		if (authLevel.equals(USER_ONLY)) {
			return true;
		}
		String email = getPayloadJson(token).get("email").asText();
		switch (authLevel) {
			case USER_OR_ADMIN:
				if (isAdminEmail(email)) {
					return userService.getAdminUserRole(email) >= AdminRole.ADMIN.ordinal();
				}
				return true;
			case ADMIN_ONLY:
				return userService.getAdminUserRole(email).equals(AdminRole.MASTER.ordinal());
			case MASTER_ONLY:
				return email.equals(masterProperties.getEmail());
			default:
				return false;
		}
	}

	private boolean isAdminEmail(String email) {
		return email.endsWith(masterProperties.getDomain())
				|| email.endsWith(domainNameProperties.getAdminEmailDomain());
	}
}
