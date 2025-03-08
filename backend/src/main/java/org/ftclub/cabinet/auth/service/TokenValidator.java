package org.ftclub.cabinet.auth.service;

import static org.ftclub.cabinet.admin.admin.domain.AdminRole.MASTER;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import java.security.Key;
import java.util.Base64;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.admin.admin.service.AdminQueryService;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.stereotype.Component;

/**
 * 토큰의 유효성을 검사하는 클래스입니다.
 * <p>
 * ToDo : 인증 정책을 관리하는 도메인을 별도로 두어 관리하기
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TokenValidator {

	private static final String UNDEFINED = "undefined";
	private final JwtProperties jwtProperties;
	private final UserQueryService userQueryService;
	private final AdminQueryService adminQueryService;
	private final ObjectMapper objectMapper;

	/**
	 * 토큰의 유효성을 검사합니다.
	 *
	 * @param token     검사할 토큰
	 * @param authLevel 검사할 토큰의 레벨
	 * @return 정상적인 방식의 토큰 요청인지, 유효한 토큰인지 여부
	 */
	public boolean isValidTokenWithLevel(String token, AuthLevel authLevel)
			throws JsonProcessingException {
		if (token == null || token.isEmpty() || token.equals(UNDEFINED)) {
			throw ExceptionStatus.UNAUTHORIZED.asControllerException();
		}
		String email = getPayloadJson(token).get("email").asText();
		if (email == null) {
			throw ExceptionStatus.INVALID_ARGUMENT.asServiceException();
		}
		if (!isTokenValid(token, jwtProperties.getSigningKey())) {
			return false;
		}

		switch (authLevel) {
			case USER_OR_ADMIN:
				return isUser(email) || isAdmin(email);
			case USER_ONLY:
				return isUser(email);
			case ADMIN_ONLY:
				return isAdmin(email);
			case MASTER_ONLY:
				return isMaster(email);
			default:
				throw ExceptionStatus.INVALID_STATUS.asServiceException();
		}
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
	public boolean isTokenValid(String token, Key key) {
		try {
			Jwts.parserBuilder()
					.setSigningKey(key).build()
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
		} catch (Exception e) {
			log.error("token error = {}", e.toString());
			log.error("token error message = {}", e.getMessage());
			log.info("JWT 토큰 검사 중 알 수 없는 오류가 발생했습니다.");
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
		if (token == null || token.isEmpty() || token.equals(UNDEFINED)) {
			return null;
		}
		final String payloadJWT = token.split("\\.")[1];
		Base64.Decoder decoder = Base64.getUrlDecoder();

		return objectMapper.readTree(new String(decoder.decode(payloadJWT)));
	}

	/**
	 * 해당 이메일이 관리자 이메일인지 확인합니다.
	 *
	 * @param email 관리자 이메일
	 * @return 관리자 이메일이면 true를 반환합니다.
	 */
	private boolean isAdmin(String email) {
		AdminRole role = adminQueryService.findByEmail(email)
				.map(Admin::getRole)
				.orElse(null);
		return role != null && (role.equals(AdminRole.ADMIN) || role.equals(MASTER));
	}

	private boolean isMaster(String email) {
		AdminRole role = adminQueryService.findByEmail(email)
				.map(Admin::getRole)
				.orElse(null);
		return role != null && role.equals(MASTER);
	}

	private boolean isUser(String email) {
		return userQueryService.findUserByEmail(email).isPresent();
	}

}
