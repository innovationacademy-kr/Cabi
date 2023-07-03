package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.TokenProvider;
import org.ftclub.cabinet.config.ApiProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import javax.servlet.http.Cookie;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class AuthFacadeServiceImplUnitTest {

	@InjectMocks
	AuthFacadeServiceImpl authFacadeService;
	@Mock
	JwtProperties jwtProperties = mock(JwtProperties.class);
	@Mock
	TokenProvider tokenProvider = mock(TokenProvider.class);
	@Mock
	CookieManager cookieManager = mock(CookieManager.class);
	@Mock
	AuthService authService = mock(AuthService.class);
	@Mock
	OauthService oauthService = mock(OauthService.class);
	@Mock
	ApiProperties apiProperties = mock(ApiProperties.class);

	MockHttpServletRequest request = new MockHttpServletRequest();
	MockHttpServletResponse response = new MockHttpServletResponse();

	@Test
	@DisplayName("성공: OAuth API 서버에 로그인 요청")
	void 성공_requestLoginToApi() throws IOException {
		authFacadeService.requestLoginToApi(response, apiProperties);
		then(oauthService).should().sendToApi(response, apiProperties);
	}

	@Test
	@DisplayName("성공: OAuth API 로그인 및 서비스 JWT 토큰 발급")
	void 성공_handleLogin() {
		JsonNode profileJsonNode = mock(JsonNode.class);
		Map<String, Object> claims = mock(Map.class);
		LocalDateTime timeTokenCreated = LocalDateTime.now();
		given(apiProperties.getProviderName()).willReturn("providerName");
		request.setServerName("serverName");
		given(oauthService.getTokenByCode("code", apiProperties)).willReturn("apiToken");
		given(oauthService.getProfileByToken("apiToken", apiProperties)).willReturn(profileJsonNode);
		given(tokenProvider.makeClaimsByProviderProfile(apiProperties.getProviderName(), profileJsonNode)).willReturn(claims);
		given(tokenProvider.createToken(claims, timeTokenCreated)).willReturn("accessToken");
		given(tokenProvider.getTokenNameByProvider(apiProperties.getProviderName())).willReturn("tokenName");
		given(cookieManager.cookieOf("tokenName", "accessToken")).willReturn(new Cookie("tokenName", "accessToken"));
		Cookie mustPutCookie = cookieManager.cookieOf("tokenName", "accessToken");

		authFacadeService.handleLogin("code", request, response, apiProperties, timeTokenCreated);

		then(authService).should().addUserIfNotExistsByClaims(claims);
		then(cookieManager).should().setCookieToClient(response, mustPutCookie, "/", request.getServerName());
	}

	@Test
	@DisplayName("성공: 최고 관리자 토큰 발급")
	void 성공_masterLogin() {
		LocalDateTime now = LocalDateTime.now();
		MasterLoginDto masterLoginDto = mock(MasterLoginDto.class);
		given(authService.validateMasterLogin(masterLoginDto)).willReturn(true);
		given(tokenProvider.createMasterToken(now)).willReturn("masterToken");
		given(jwtProperties.getAdminTokenName()).willReturn("adminTokenName");
		given(cookieManager.cookieOf(jwtProperties.getAdminTokenName(), "masterToken")).willReturn(new Cookie("adminTokenName", "masterToken"));
		Cookie mustPutCookie = cookieManager.cookieOf(jwtProperties.getAdminTokenName(), "masterToken");

		authFacadeService.masterLogin(masterLoginDto, request, response, now);

		then(cookieManager).should().setCookieToClient(response, mustPutCookie, "/", request.getServerName());
	}

	@Test
	@DisplayName("실패: 유효하지 않은 최고 관리자 로그인 시도")
	void 실패_masterLogin() {
		MasterLoginDto masterLoginDto = mock(MasterLoginDto.class);
		given(authService.validateMasterLogin(masterLoginDto)).willReturn(false);

		ControllerException exception = assertThrows(
				ControllerException.class, () -> authFacadeService.masterLogin(masterLoginDto, request, response, LocalDateTime.now()));
		assertEquals(ExceptionStatus.UNAUTHORIZED, exception.getStatus());
	}

	@Test
	@DisplayName("성공: 로그아웃")
	void 성공_logout() {
		ApiProperties apiProperties = mock(ApiProperties.class);
		given(apiProperties.getProviderName()).willReturn("providerName");
		given(tokenProvider.getTokenNameByProvider(apiProperties.getProviderName())).willReturn("tokenName");

		authFacadeService.logout(response, apiProperties);

		then(cookieManager).should().deleteCookie(response, "tokenName");
	}
}