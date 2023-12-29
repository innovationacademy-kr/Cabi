package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class FtApiProperties implements ApiProperties {

    @Value("${cabinet.oauth2.client.registration.ft.name}")
    private String providerName;

    @Value("${cabinet.oauth2.auth.ft.client-id}")
    private String clientId;

    @Value("${cabinet.oauth2.auth.ft.client-secret}")
    private String clientSecret;

    @Value("${cabinet.oauth2.urls.user-login-callback}")
    private String redirectUri;

    @Value("${cabinet.oauth2.client.registration.ft.grant-type}")
    private String grantType;

    @Value("${cabinet.oauth2.client.registration.ft.access-token-name}")
    private String accessTokenName;

    @Value("${cabinet.oauth2.client.registration.ft.token-grant-type}")
    private String tokenGrantType;

    @Value("${cabinet.oauth2.client.registration.provider.ft.token-uri}")
    private String tokenUri;

    @Value("${cabinet.oauth2.client.registration.provider.ft.authorization-uri}")
    private String authUri;

    @Value("${cabinet.oauth2.client.registration.provider.ft.user-info-uri}")
    private String userInfoUri;

    @Value("${cabinet.oauth2.client.registration.provider.ft.users-info-uri}")
    private String usersInfoUri;

    @Value("${cabinet.oauth2.client.registration.ft.scope}")
    private String scope;
}
