package org.ftclub.cabinet.config;

import io.jsonwebtoken.SignatureAlgorithm;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;

@Component
@Getter
public class JwtProperties {

    @Value("${cabinet.jwt.jwt-secret-key}")
    private String secret;

    @Value("${cabinet.jwt.token.main-token-name}")
    private String mainTokenName;

    @Value("${cabinet.jwt.token.main-provider}")
    private String mainProviderName;

    @Value("${cabinet.jwt.token.admin-token-name}")
    private String adminTokenName;

    @Value("${cabinet.jwt.token.admin-provider}")
    private String adminProviderName;

    @Value("${cabinet.jwt.token.expiry}")
    private Integer expiryDays;

    public Key getSigningKey() {
        byte[] secretKeyBytes = DatatypeConverter.parseBase64Binary(this.secret);
        return new SecretKeySpec(secretKeyBytes, SignatureAlgorithm.HS256.getJcaName());
    }
}
