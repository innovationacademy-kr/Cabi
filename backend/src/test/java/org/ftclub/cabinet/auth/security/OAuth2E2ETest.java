package org.ftclub.cabinet.auth.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class OAuth2E2ETest {

	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	@DisplayName("OAuth2 로그인 시 인증 페이지로 리다이렉트")
	void oauth2LoginRedirect() {
		ResponseEntity<String> response = restTemplate.getForEntity("/oauth2/authorization/ft",
				String.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FOUND);
	}
}
