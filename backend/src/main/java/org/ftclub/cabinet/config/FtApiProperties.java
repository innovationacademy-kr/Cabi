package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class FtApiProperties implements ApiProperties {

    @Value("${spring.oauth2.client.registration.ft.name}")
    private String providerName;

    @Value("${spring.auth.ft.client-id}")
    private String clientId;

    @Value("${spring.auth.ft.client-secret}")
    private String clientSecret;

    @Value("${spring.urls.user-login-callback}")
    private String redirectUri;

    @Value("${spring.oauth2.client.registration.ft.grant-type}")
    private String grantType;

    @Value("${spring.oauth2.client.registration.ft.access-token-name}")
    private String accessTokenName;

    @Value("${spring.oauth2.client.registration.provider.ft.token-uri}")
    private String tokenUri;

    @Value("${spring.oauth2.client.registration.provider.ft.authorization-uri}")
    private String authUri;

    @Value("${spring.oauth2.client.registration.provider.ft.user-info-uri}")
    private String userInfoUri;

    @Value("${spring.oauth2.client.registration.ft.scope}")
    private String scope;
}
