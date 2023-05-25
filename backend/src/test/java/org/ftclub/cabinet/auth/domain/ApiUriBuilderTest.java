package org.ftclub.cabinet.auth.domain;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ApiUriBuilderTest {

	@Test
	void uri_생성() {
		String authUri = "https://urifor.auth";
		String clientId = "client_id";
		String redirectUri = "https://urifor.auth/callback";
		String scope = "profile";
		String grantType = "code";

		String uri = ApiUriBuilder
				.builder()
				.authUri(authUri)
				.clientId(clientId)
				.redirectUri(redirectUri)
				.scope(scope)
				.grantType(grantType)
				.build()
				.getCodeRequestUri();

		//"%s?client_id=%s&redirect_uri=%s&scope=%s&response_type=%s"
		Assertions.assertEquals(
				"https://urifor.auth?client_id=client_id&redirect_uri=https://urifor.auth/callback&scope=profile&response_type=code",
				uri);
	}
}
