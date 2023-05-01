package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
@Configuration
@Getter
public class JwtProperties {

    @Value("${jwt.token.secret-key}")
    private String secret;

    @Value("${jwt.token.main-token-name}")
    private String mainTokenName;

    @Value("${jwt.token.admin-token-name}")
    private String adminTokenName;

    @Value("${jwt.token.expiry}")
    private Integer expiry;
}
