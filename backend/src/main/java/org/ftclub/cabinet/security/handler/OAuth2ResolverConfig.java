package org.ftclub.cabinet.security.handler;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;

@Configuration
@RequiredArgsConstructor
public class OAuth2ResolverConfig {

	private final JwtService jwtService;
	private final ClientRegistrationRepository clientRegistrationRepository;

	@Bean
	public OAuth2AuthorizationRequestResolver defaultAuthorizationRequestResolver() {
		return new DefaultOAuth2AuthorizationRequestResolver(
				clientRegistrationRepository, "/oauth2/authorization"
		);
	}

	@Bean
	public CustomAuthorizationRequestResolver customAuthorizationRequestResolver() {
		return new CustomAuthorizationRequestResolver(
				defaultAuthorizationRequestResolver(), jwtService);
	}
}
