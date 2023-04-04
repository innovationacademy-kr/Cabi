package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
@Configuration
@Getter
public class FtApiProperties {

	@Value("${oauth2.client.registration.ft.client-id}")
	private String clientId;

	@Value("${oauth2.client.registration.ft.client-secret}")
	private String clientSecret;

	@Value("${oauth2.client.registration.ft.redirect-uri}")
	private String redirectUri;

	@Value("${oauth2.client.registration.ft.authorization-grant-type}")
	private String grantType;

	@Value("${oauth2.client.registration.provider.ft.token-uri}")
	private String tokenUri;

	@Value("${oauth2.client.registration.provider.ft.authorization-uri}")
	private String authUri;

	@Value("${oauth2.client.registration.provider.ft.user-info-uri}")
	private String userInfoUri;

	@Value("${oauth2.client.registration.ft.scope}")
	private String scope;
}
