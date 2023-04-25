package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
@Configuration
@Getter
public class GoogleApiProperties {

	@Value("${oauth2.client.registration.google.name}")
	private String name;

	@Value("${oauth2.client.registration.provider.google.authorization-uri}")
	private String authUri;

	@Value("${oauth2.client.registration.google.redirect-uri}")
	private String redirectUri;

	@Value("${oauth2.client.registration.google.grant-type}")
	private String grantType;

	@Value("${oauth2.client.registration.provider.google.token-uri}")
	private String tokenUri;

	@Value("${oauth2.client.registration.provider.google.user-info-uri}")
	private String userInfoUri;

	@Value("${oauth2.client.registration.google.client-id}")
	private String clientId;

	@Value("${oauth2.client.registration.google.client-secret}")
	private String clientSecret;

	@Value("${oauth2.client.registration.google.scope}")
	private String scope;

	@Value("${oauth2.client.registration.google.access-token-name}")
	private String accessTokenName;
}
