package org.ftclub.cabinet.auth.domain;

import org.ftclub.cabinet.config.DomainProperties;
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
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
public class CookieManagerUnitTest {

    @Mock
    DomainProperties domainProperties = mock(DomainProperties.class);

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
    @DisplayName("성공: DomainName이 Local일 때")
    void 성공_setCookie() {
    }

    @Test
    @DisplayName("성공: DomainName이 Local이 아닐 때")
    void 성공_setCookie2() {
    }

    @Test
    void 성공_deleteCookie() {
    }

    @Test
    void 실패_deleteCookie() {
    }
}
