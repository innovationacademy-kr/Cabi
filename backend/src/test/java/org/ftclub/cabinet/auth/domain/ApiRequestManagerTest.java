package org.ftclub.cabinet.auth.domain;

import static org.mockito.Mockito.when;

import org.ftclub.cabinet.config.ApiProperties;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ApiRequestManagerTest {

	@Mock
	private ApiProperties apiProperties;

	@Test
	void uri_생성() {
		when(apiProperties.getAuthUri()).thenReturn("https://urifor.auth");
		when(apiProperties.getClientId()).thenReturn("client_id");
		when(apiProperties.getRedirectUri()).thenReturn("https://urifor.auth/callback");
		when(apiProperties.getScope()).thenReturn("profile");
		when(apiProperties.getGrantType()).thenReturn("code");

		String uri = ApiRequestManager.of(apiProperties)
				.getCodeRequestUri();

		//"%s?client_id=%s&redirect_uri=%s&scope=%s&response_type=%s"
		Assertions.assertEquals(
				"https://urifor.auth?client_id=client_id&redirect_uri=https://urifor.auth/callback&scope=profile&response_type=code",
				uri);
	}
}
