package org.ftclub.cabinet.auth.domain;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AuthAspectUnitTest {

//	private final MockHttpServletRequest request = new MockHttpServletRequest();
//	private final MockHttpServletResponse response = new MockHttpServletResponse();
//	@Mock
//	TokenValidator tokenValidator = mock(TokenValidator.class);
//	@Mock
//	JwtProperties jwtProperties = mock(JwtProperties.class);
//	@Mock
//	CookieManager cookieManager = mock(CookieManager.class);
//	@Mock
//	private AuthGuard authGuard = mock(AuthGuard.class);
//	@InjectMocks
//	private AuthAspect authAspect;
//
//	@BeforeEach
//	void setUp() {
//		RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request, response));
//		given(jwtProperties.getMainTokenName()).willReturn("mainToken");
//		given(jwtProperties.getAdminTokenName()).willReturn("adminToken");
//	}
//
//
//	@Test
//	@DisplayName("성공: ADMIN_ONLY, 토큰이 유효할 때")
//	void 성공_authToken_ADMIN_ONLY() throws JsonProcessingException {
//		given(authGuard.level()).willReturn(ADMIN_ONLY);
//		given(tokenValidator.isValidRequestWithLevel(request, authGuard.level())).willReturn(true);
//
//		assertDoesNotThrow(() -> authAspect.AuthToken(authGuard));
//	}
//
//	@Test
//	@DisplayName("실패: ADMIN_ONLY, 토큰이 유효하지 않을 때")
//	void 실패_authToken_ADMIN_ONLY() throws JsonProcessingException {
//		given(authGuard.level()).willReturn(ADMIN_ONLY);
//		given(tokenValidator.isValidRequestWithLevel(request, authGuard.level())).willReturn(false);
//		ControllerException exception;
//
//		exception = assertThrows(ControllerException.class, () -> authAspect.AuthToken(authGuard));
//		assertEquals(ExceptionStatus.UNAUTHORIZED_ADMIN, exception.getStatus());
//		then(cookieManager).should().deleteCookie(response, jwtProperties.getAdminTokenName());
//	}
//
//	@Test
//	@DisplayName("성공: USER_ONLY, 토큰이 유효할 때")
//	void 성공_authToken_USER_ONLY() throws JsonProcessingException {
//		given(authGuard.level()).willReturn(AuthLevel.USER_ONLY);
//		given(tokenValidator.isValidRequestWithLevel(request, authGuard.level())).willReturn(true);
//
//		assertDoesNotThrow(() -> authAspect.AuthToken(authGuard));
//	}
//
//	@Test
//	@DisplayName("실패: USER_ONLY, 토큰이 유효하지 않을 때")
//	void 실패_authToken_USER_ONLY() throws JsonProcessingException {
//		given(authGuard.level()).willReturn(AuthLevel.USER_ONLY);
//		given(tokenValidator.isValidRequestWithLevel(request, authGuard.level())).willReturn(false);
//		ControllerException exception;
//
//		exception = assertThrows(ControllerException.class, () -> authAspect.AuthToken(authGuard));
//		assertEquals(ExceptionStatus.UNAUTHORIZED_USER, exception.getStatus());
//		then(cookieManager).should().deleteCookie(response, jwtProperties.getMainTokenName());
//	}
//
//	@Test
//	@DisplayName("성공: USER_OR_ADMIN, 토큰이 유효할 때")
//	void 성공_authToken_USER_OR_ADMIN() throws JsonProcessingException {
//		given(authGuard.level()).willReturn(AuthLevel.USER_OR_ADMIN);
//		given(tokenValidator.isValidRequestWithLevel(request, authGuard.level())).willReturn(true);
//
//		assertDoesNotThrow(() -> authAspect.AuthToken(authGuard));
//	}
//
//	@Test
//	@DisplayName("실패: USER_OR_ADMIN, 토큰이 유효하지 않을 때")
//	void 실패_authToken_USER_OR_ADMIN() throws JsonProcessingException {
//		given(authGuard.level()).willReturn(AuthLevel.USER_OR_ADMIN);
//		given(tokenValidator.isValidRequestWithLevel(request, authGuard.level())).willReturn(false);
//		ControllerException exception;
//
//		exception = assertThrows(ControllerException.class, () -> authAspect.AuthToken(authGuard));
//		assertEquals(ExceptionStatus.UNAUTHORIZED, exception.getStatus());
//		then(cookieManager).should().deleteCookie(response, jwtProperties.getMainTokenName());
//		then(cookieManager).should().deleteCookie(response, jwtProperties.getAdminTokenName());
//	}
}