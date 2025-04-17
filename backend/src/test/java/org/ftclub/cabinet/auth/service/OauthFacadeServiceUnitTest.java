package org.ftclub.cabinet.auth.service;

import static org.mockito.Mockito.mock;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class OauthFacadeServiceUnitTest {

//	@InjectMocks
//	OauthService oauthService;

	@Mock
	ObjectMapper objectMapper = mock(ObjectMapper.class);

	@Test
	@DisplayName("외부 API 의존으로 생략")
	@Disabled
	void sendToApi() {

	}

	@Test
	@DisplayName("외부 API 의존으로 생략")
	@Disabled
	void getTokenByCode() {
	}

	@Test
	@DisplayName("외부 API 의존으로 생략")
	@Disabled
	void getProfileByToken() {
	}
}
