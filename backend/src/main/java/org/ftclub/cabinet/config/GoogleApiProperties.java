package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class GoogleApiProperties implements ApiProperties {

    @Value("${spring.oauth2.client.registration.google.name}")
    private String providerName;

    @Value("${spring.auth.google.client-id}")
    private String clientId;

    @Value("${spring.auth.google.client-secret}")
    private String clientSecret;

    @Value("${spring.urls.admin-login-callback}")
    private String redirectUri;

    @Value("${spring.oauth2.client.registration.google.grant-type}")
    private String grantType;

    @Value("${spring.oauth2.client.registration.google.access-token-name}")
    private String accessTokenName;

    @Value("${spring.oauth2.client.registration.provider.google.token-uri}")
    private String tokenUri;

    @Value("${spring.oauth2.client.registration.provider.google.authorization-uri}")
    private String authUri;

    @Value("${spring.oauth2.client.registration.provider.google.user-info-uri}")
    private String userInfoUri;

    @Value("${spring.oauth2.client.registration.google.scope}")
    private String scope;
}
