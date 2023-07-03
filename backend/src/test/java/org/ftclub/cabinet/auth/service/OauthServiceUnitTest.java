package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
public class OauthServiceUnitTest {

	@InjectMocks
	OauthService oauthService;
    
	@Mock
	ObjectMapper objectMapper = mock(ObjectMapper.class);

	@Test
	void sendToApi() {

	}

	@Test
	void getTokenByCode() {
	}

	@Test
	void getProfileByToken() {
	}
}
