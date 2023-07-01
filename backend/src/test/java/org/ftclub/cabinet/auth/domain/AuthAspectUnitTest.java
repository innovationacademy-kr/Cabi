package org.ftclub.cabinet.auth.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class AuthAspectUnitTest {

    @Mock
    TokenValidator tokenValidator = mock(TokenValidator.class);

    @Mock
    JwtProperties jwtProperties = mock(JwtProperties.class);

    @Mock
    CookieManager cookieManager = mock(CookieManager.class);
    @Mock
    private AuthGuard authGuard = mock(AuthGuard.class);
    @InjectMocks
    private AuthAspect authAspect;
    private MockHttpServletRequest request = new MockHttpServletRequest();
    private MockHttpServletResponse response = new MockHttpServletResponse();

    @BeforeEach
    void setUp() {
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request, response));
        given(jwtProperties.getMainTokenName()).willReturn("mainToken");
        given(jwtProperties.getAdminTokenName()).willReturn("adminToken");
    }


    @Test
    @DisplayName("성공: ADMIN_ONLY, 토큰이 유효할 때")
    void 성공_authToken_ADMIN_ONLY() throws JsonProcessingException {
        given(authGuard.level()).willReturn(ADMIN_ONLY);
        given(tokenValidator.isTokenValid(request, authGuard.level())).willReturn(true);

        assertDoesNotThrow(() -> authAspect.AuthToken(authGuard));
    }

    @Test
    @DisplayName("실패: ADMIN_ONLY, 토큰이 유효하지 않을 때")
    void 실패_authToken_ADMIN_ONLY() throws JsonProcessingException {
        given(authGuard.level()).willReturn(ADMIN_ONLY);
        given(tokenValidator.isTokenValid(request, authGuard.level())).willReturn(false);
        ControllerException exception;

        exception = assertThrows(ControllerException.class, () -> authAspect.AuthToken(authGuard));
        assertEquals(ExceptionStatus.UNAUTHORIZED_ADMIN, exception.getStatus());
        then(cookieManager).should().deleteCookie(response, jwtProperties.getAdminTokenName());
    }

    @Test
    @DisplayName("성공: USER_ONLY, 토큰이 유효할 때")
    void 성공_authToken_USER_ONLY() throws JsonProcessingException {
        given(authGuard.level()).willReturn(AuthLevel.USER_ONLY);
        given(tokenValidator.isTokenValid(request, authGuard.level())).willReturn(true);

        assertDoesNotThrow(() -> authAspect.AuthToken(authGuard));
    }

    @Test
    @DisplayName("실패: USER_ONLY, 토큰이 유효하지 않을 때")
    void 실패_authToken_USER_ONLY() throws JsonProcessingException {
        given(authGuard.level()).willReturn(AuthLevel.USER_ONLY);
        given(tokenValidator.isTokenValid(request, authGuard.level())).willReturn(false);
        ControllerException exception;

        exception = assertThrows(ControllerException.class, () -> authAspect.AuthToken(authGuard));
        assertEquals(ExceptionStatus.UNAUTHORIZED_USER, exception.getStatus());
        then(cookieManager).should().deleteCookie(response, jwtProperties.getMainTokenName());
    }

    @Test
    @DisplayName("성공: USER_OR_ADMIN, 토큰이 유효할 때")
    void 성공_authToken_USER_OR_ADMIN() throws JsonProcessingException {
        given(authGuard.level()).willReturn(AuthLevel.USER_OR_ADMIN);
        given(tokenValidator.isTokenValid(request, authGuard.level())).willReturn(true);

        assertDoesNotThrow(() -> authAspect.AuthToken(authGuard));
    }

    @Test
    @DisplayName("실패: USER_OR_ADMIN, 토큰이 유효하지 않을 때")
    void 실패_authToken_USER_OR_ADMIN() throws JsonProcessingException {
        given(authGuard.level()).willReturn(AuthLevel.USER_OR_ADMIN);
        given(tokenValidator.isTokenValid(request, authGuard.level())).willReturn(false);
        ControllerException exception;

        exception = assertThrows(ControllerException.class, () -> authAspect.AuthToken(authGuard));
        assertEquals(ExceptionStatus.UNAUTHORIZED, exception.getStatus());
        then(cookieManager).should().deleteCookie(response, jwtProperties.getMainTokenName());
        then(cookieManager).should().deleteCookie(response, jwtProperties.getAdminTokenName());
    }
}