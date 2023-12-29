package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class GoogleApiProperties implements ApiProperties {

    @Value("${cabinet.oauth2.client.registration.google.name}")
    private String providerName;

    @Value("${cabinet.oauth2.auth.google.client-id}")
    private String clientId;

    @Value("${cabinet.oauth2.auth.google.client-secret}")
    private String clientSecret;

    @Value("${cabinet.oauth2.urls.admin-login-callback}")
    private String redirectUri;

    @Value("${cabinet.oauth2.client.registration.google.grant-type}")
    private String grantType;

    @Value("${cabinet.oauth2.client.registration.google.access-token-name}")
    private String accessTokenName;

    @Value("${cabinet.oauth2.client.registration.google.token-grant-type}")
    private String tokenGrantType;

    @Value("${cabinet.oauth2.client.registration.provider.google.token-uri}")
    private String tokenUri;

    @Value("${cabinet.oauth2.client.registration.provider.google.authorization-uri}")
    private String authUri;

    @Value("${cabinet.oauth2.client.registration.provider.google.user-info-uri}")
    private String userInfoUri;

    @Value("${cabinet.oauth2.client.registration.google.scope}")
    private String scope;
}
