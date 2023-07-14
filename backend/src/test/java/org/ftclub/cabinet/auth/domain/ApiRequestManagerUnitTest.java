package org.ftclub.cabinet.auth.domain;

import org.ftclub.cabinet.config.ApiProperties;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.util.MultiValueMap;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
public class ApiRequestManagerUnitTest {

	@Mock(lenient = true)
	ApiProperties apiProperties = mock(ApiProperties.class);

	@InjectMocks
	ApiRequestManager apiRequestManager;

	@BeforeEach
	void setUp() {
		given(apiProperties.getAuthUri()).willReturn("https://urifor.auth");
		given(apiProperties.getClientId()).willReturn("client_id");
		given(apiProperties.getClientSecret()).willReturn("client_secret");
		given(apiProperties.getRedirectUri()).willReturn("https://urifor.auth/callback");
		given(apiProperties.getScope()).willReturn("profile");
		given(apiProperties.getGrantType()).willReturn("code");
	}

	@Test
	@DisplayName("실패 - 주입 받는 ApiProperties가 null인 경우")
	void fail() {
		DomainException exception = assertThrows(DomainException.class, () -> {
			ApiRequestManager.of(null);
		});
		assertEquals(ExceptionStatus.INVALID_ARGUMENT, exception.getStatus());
	}


	@Test
	@DisplayName("성공 - code 요청 uri 생성")
	void getCodeRequestUri() {
		String expect = apiProperties.getAuthUri() +
				"?client_id=" + apiProperties.getClientId() +
				"&redirect_uri=" + apiProperties.getRedirectUri() +
				"&scope=" + apiProperties.getScope() +
				"&response_type=" + apiProperties.getGrantType();
		String result = apiRequestManager.getCodeRequestUri();

		assertEquals(expect, result);
	}

	@Test
	@DisplayName("성공 - access token 요청 body map 생성")
	void getAccessTokenRequestBodyMap() {
		String codeFromCallback = "code";
		MultiValueMap<String, String> result = apiRequestManager.getAccessTokenRequestBodyMap(
				codeFromCallback);

		assertEquals(apiProperties.getClientId(), result.get("client_id").get(0));
		assertEquals(apiProperties.getClientSecret(), result.get("client_secret").get(0));
		assertEquals(apiProperties.getRedirectUri(), result.get("redirect_uri").get(0));
		assertEquals(apiProperties.getTokenGrantType(), result.get("grant_type").get(0));
		assertEquals(codeFromCallback, result.get("code").get(0));
	}

	@Test
	@DisplayName("성공 - access token 요청 body map with client secret 생성")
	void getAccessTokenRequestBodyMapWithClientSecret() {
		String grantType = "grant_type";

		MultiValueMap<String, String> result = apiRequestManager.getAccessTokenRequestBodyMapWithClientSecret(
				grantType);

		assertEquals(apiProperties.getClientId(), result.get("client_id").get(0));
		assertEquals(apiProperties.getClientSecret(), result.get("client_secret").get(0));
		System.out.println(result.get("grant_type").get(0));
	}
}
