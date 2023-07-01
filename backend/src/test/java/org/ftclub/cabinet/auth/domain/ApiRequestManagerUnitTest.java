package org.ftclub.cabinet.auth.domain;

import org.ftclub.cabinet.config.ApiProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.util.MultiValueMap;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ApiRequestManagerUnitTest {

    @Mock
    ApiProperties apiProperties;

    ApiRequestManager apiRequestManager;

    @BeforeEach
    void setUp() {
        apiProperties = mock(ApiProperties.class);
        apiRequestManager = ApiRequestManager.of(apiProperties);
    }

    @Test
    void getCodeRequestUri() {
        String authUri = "https://urifor.auth";
        String clientId = "client_id";
        String redirectUri = "https://urifor.auth/callback";
        String scope = "profile";
        String responseType = "code";
        when(apiProperties.getAuthUri()).thenReturn(authUri);
        when(apiProperties.getClientId()).thenReturn(clientId);
        when(apiProperties.getRedirectUri()).thenReturn(redirectUri);
        when(apiProperties.getScope()).thenReturn(scope);
        when(apiProperties.getGrantType()).thenReturn(responseType);

        String expect = authUri +
                "?client_id=" + clientId +
                "&redirect_uri=" + redirectUri +
                "&scope=" + scope +
                "&response_type=" + responseType;
        String result = apiRequestManager.getCodeRequestUri();

        assertEquals(expect, result);
    }

    @Test
    void getAccessTokenRequestBodyMap() {
        String code = "code";
        String clientId = "client_id";
        String clientSecret = "client_secret";
        String redirectUri = "https://urifor.auth/callback";
        String tokenGrantType = "grant_type";
        when(apiProperties.getClientId()).thenReturn(clientId);
        when(apiProperties.getClientSecret()).thenReturn(clientSecret);
        when(apiProperties.getRedirectUri()).thenReturn(redirectUri);
        when(apiProperties.getTokenGrantType()).thenReturn(tokenGrantType);

        MultiValueMap<String, String> result = apiRequestManager.getAccessTokenRequestBodyMap(code);
        assertEquals(clientId, result.get("client_id").get(0));
        assertEquals(clientSecret, result.get("client_secret").get(0));
        assertEquals(redirectUri, result.get("redirect_uri").get(0));
        assertEquals(tokenGrantType, result.get("grant_type").get(0));
        assertEquals(code, result.get("code").get(0));
    }
}
