package org.ftclub.cabinet.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.utils.DateUtil;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

/**
 * API 제공자에 따라 JWT 토큰을 생성하는 클래스입니다.
 */
@Component
@RequiredArgsConstructor
public class TokenProvider {

    private final JwtProperties jwtProperties;

    private final GoogleApiProperties googleApiProperties;

    private final FtApiProperties ftApiProperties;

    /**
     * JWT 토큰에 담을 클레임(Payload)을 생성합니다.
     *
     * @param provider API 제공자 이름
     * @param profile  API 제공자로부터 받은 프로필
     * @return JWT 클레임(Payload)
     */
    public Map<String, Object> makeClaims(String provider, JSONObject profile) {
        Map<String, Object> claims = new HashMap<>();
        if (provider == googleApiProperties.getName()) {
            claims.put("email", profile.get("email").toString());
        }
        if (provider == ftApiProperties.getName()) {
            claims.put("name", profile.get("login").toString());
            claims.put("email", profile.get("email").toString());
            claims.put("blackholedAt", profile.getJSONArray("cursus_users")
                    .getJSONObject(1)
                    .get("blackholed_at") != JSONObject.NULL ?
                    profile.getJSONArray("cursus_users")
                            .getJSONObject(1)
                            .get("blackholed_at") : null);
            claims.put("role", UserRole.USER);
        }
        return claims;
    }

    /**
     * JWT 토큰을 생성합니다.
     *
     * @param provider API 제공자 이름
     * @param profile  API 제공자로부터 받은 프로필
     * @param now      현재 시각
     * @return JWT 토큰
     */
    public String createToken(String provider, JSONObject profile, Date now) {
        return Jwts.builder()
                .setClaims(makeClaims(provider, profile))
                .signWith(jwtProperties.getSigningKey(), SignatureAlgorithm.HS256)
                .setExpiration(DateUtil.addDaysToDate(now, jwtProperties.getExpiry()))
                .compact();
    }


}
