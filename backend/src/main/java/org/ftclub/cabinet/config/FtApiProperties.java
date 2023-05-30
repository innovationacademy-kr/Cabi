package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class FtApiProperties implements ApiProperties {

	@Value("${oauth2.client.registration.ft.name}")
	private String providerName;

	@Value("${oauth2.client.registration.ft.client-id}")
	private String clientId;

	@Value("${oauth2.client.registration.ft.client-secret}")
	private String clientSecret;

	@Value("${spring.cabinet.urls.user-login-callback}")
	private String redirectUri;

	@Value("${oauth2.client.registration.ft.grant-type}")
	private String grantType;

	@Value("${oauth2.client.registration.ft.access-token-name}")
	private String accessTokenName;

	@Value("${oauth2.client.registration.provider.ft.token-uri}")
	private String tokenUri;

	@Value("${oauth2.client.registration.provider.ft.authorization-uri}")
	private String authUri;

	@Value("${oauth2.client.registration.provider.ft.user-info-uri}")
	private String userInfoUri;

	@Value("${oauth2.client.registration.ft.scope}")
	private String scope;
}
