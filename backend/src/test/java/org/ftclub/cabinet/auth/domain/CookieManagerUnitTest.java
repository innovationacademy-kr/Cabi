package org.ftclub.cabinet.auth.domain;

import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import javax.servlet.http.Cookie;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
public class CookieManagerUnitTest {

    @Mock
    DomainProperties domainProperties = mock(DomainProperties.class);

    @Mock
    JwtProperties jwtProperties = mock(JwtProperties.class);

    @InjectMocks
    CookieManager cookieManager;

    MockHttpServletRequest request = new MockHttpServletRequest();

    MockHttpServletResponse response = new MockHttpServletResponse();

    @Test
    @DisplayName("성공 - key가 일치하는 쿠키가 있을 때")
    void 성공_getCookie() {
        Cookie expect = new Cookie("name", "value");
        request.setCookies(expect);

        String result = cookieManager.getCookieValue(request, "name");

        assertEquals(expect.getValue(), result);
    }

    @Test
    @DisplayName("실패 - key가 일치하는 쿠키가 없을 때")
    void 실패_getCookie() {
        Cookie expect = new Cookie("name", "value");
        request.setCookies(expect);

        String result = cookieManager.getCookieValue(request, "name2");

        assertEquals(null, result);
    }

    @Test
    @DisplayName("성공: 도메인이 Local일 때")
    void 성공_setCookieToClient() {
        given(domainProperties.getLocal()).willReturn("local");
        given(jwtProperties.getExpiryDays()).willReturn(100);
        String serverName = domainProperties.getLocal();
        String path = "/";
        Cookie cookie = new Cookie("name", "value");

        cookieManager.setCookieToClient(response, cookie, path, serverName);

        assertEquals(60 * 60 * 24 * jwtProperties.getExpiryDays(), cookie.getMaxAge());
        assertEquals(path, cookie.getPath());
        assertEquals(domainProperties.getLocal(), cookie.getDomain());
        assertTrue(response.getCookie("name") != null);
    }

    @Test
    @DisplayName("성공: 도메인이 Local이 아닌 다른 도메인일 때")
    void 성공_setCookieToClient2() {
        given(domainProperties.getLocal()).willReturn("local");
        given(domainProperties.getCookieDomain()).willReturn("cookieDomain");
        given(jwtProperties.getExpiryDays()).willReturn(100);
        String serverName = domainProperties.getCookieDomain();
        String path = "/";
        Cookie cookie = new Cookie("name", "value");

        cookieManager.setCookieToClient(response, cookie, path, serverName);

        assertEquals(60 * 60 * 24 * jwtProperties.getExpiryDays(), cookie.getMaxAge());
        assertEquals(path, cookie.getPath());
        assertEquals(domainProperties.getCookieDomain(), cookie.getDomain());
        assertTrue(response.getCookie("name") != null);
    }

    @Test
    @DisplayName("성공: 쿠키 지우기")
    void 성공_deleteCookie() {
        cookieManager.deleteCookie(response, "name");
        Cookie cookie = response.getCookie("name");

        assertEquals(-1, cookie.getMaxAge());
        assertEquals(null, cookie.getValue());
    }
}
