package org.ftclub.cabinet.auth.domain;

import org.ftclub.cabinet.config.ApiProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.util.MultiValueMap;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
        given(apiProperties.getRedirectUri()).willReturn("https://urifor.auth/callback");
        given(apiProperties.getScope()).willReturn("profile");
        given(apiProperties.getGrantType()).willReturn("code");
    }

    @Test
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
    void getAccessTokenRequestBodyMap() {
        String codeFromCallback = "code";
        MultiValueMap<String, String> result = apiRequestManager.getAccessTokenRequestBodyMap(codeFromCallback);

        assertEquals(apiProperties.getClientId(), result.get("client_id").get(0));
        assertEquals(apiProperties.getClientSecret(), result.get("client_secret").get(0));
        assertEquals(apiProperties.getRedirectUri(), result.get("redirect_uri").get(0));
        assertEquals(apiProperties.getTokenGrantType(), result.get("grant_type").get(0));
        assertEquals(codeFromCallback, result.get("code").get(0));
    }
}
