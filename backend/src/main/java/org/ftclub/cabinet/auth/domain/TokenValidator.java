package org.ftclub.cabinet.auth.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.config.MasterProperties;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.service.UserService;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Base64;

import static org.ftclub.cabinet.user.domain.AdminRole.MASTER;

/**
 * 토큰의 유효성을 검사하는 클래스입니다.
 * <p>
 * ToDo : 인증 정책을 관리하는 도메인을 별도로 두어 관리하기
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TokenValidator {

    private final MasterProperties masterProperties;
    private final DomainProperties domainProperties;
    private final JwtProperties jwtProperties;
    private final UserService userService;

    /**
     * 토큰의 유효성을 검사합니다.
     * <br>
     * 매 요청시 헤더에 Bearer 토큰으로 인증을 시도하기 때문에,
     * <br>
     * 헤더에 bearer 방식으로 유효하게 토큰이 전달되었는지 검사합니다.
     * <p>
     * USER_ONLY의 경우 검증하지 않습니다.
     *
     * @param req {@link HttpServletRequest}
     * @return 정상적인 방식의 토큰 요청인지, 유효한 토큰인지 여부
     */
    public Boolean isValidRequestWithLevel(HttpServletRequest req, AuthLevel authLevel)
            throws JsonProcessingException {
        String authHeader = req.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        String token = authHeader.substring(7);
        if (!isTokenValid(token, jwtProperties.getSigningKey())) {
            return false;
        }
        return isTokenAuthenticatable(token, authLevel);
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
    public Boolean isTokenValid(String token, Key key) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build()
                    .parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException e) {
            log.debug("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            log.debug("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            log.debug("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            log.debug("JWT 토큰이 잘못되었습니다.");
        } catch (Exception e) {
            log.debug("JWT 토큰 검사 중 알 수 없는 오류가 발생했습니다.");
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
     * MASTER의 경우 현재 정적으로 관리하므로 이메일만 검증합니다.
     * <p>
     *
     * @param token     토큰
     * @param authLevel 인증 단계
     * @return 페이로드 정보가 실제 DB와 일치하면 true를 반환합니다.
     */
    public boolean isTokenAuthenticatable(String token, AuthLevel authLevel)
            throws JsonProcessingException {
        String email = getPayloadJson(token).get("email").asText();
        if (email == null) {
            throw new DomainException(ExceptionStatus.INVALID_ARGUMENT);
        }
        switch (authLevel) {
            case USER_OR_ADMIN:
                return true;
            case USER_ONLY:
                return !isAdminEmail(email);
            case ADMIN_ONLY:
                return isAdminEmail(email);
            case MASTER_ONLY:
                AdminRole role = userService.getAdminUserRole(email);
                return role != null && role.equals(MASTER);
            default:
                throw new DomainException(ExceptionStatus.INVALID_STATUS);
        }
    }

    /**
     * 해당 이메일이 관리자 이메일인지 확인합니다.
     *
     * @param email 관리자 이메일
     * @return 관리자 이메일이면 true를 반환합니다.
     */
    private boolean isAdminEmail(String email) {
        return email.endsWith(masterProperties.getDomain())
                || email.endsWith(domainProperties.getAdminEmailDomain());
    }
}
