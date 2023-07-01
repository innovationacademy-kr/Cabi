package org.ftclub.cabinet.auth.domain;

import org.ftclub.cabinet.config.DomainProperties;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import javax.servlet.http.Cookie;

import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
public class CookieManagerUnitTest {

    @Mock
    DomainProperties domainProperties = mock(DomainProperties.class);
    
    @InjectMocks
    CookieManager cookieManager;

    MockHttpServletRequest request;

    MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
    }

    @Test
    void 쿠키_가져오기() {
        request.setCookies(new Cookie("myName", "김삼순"));
        Assertions.assertEquals("김삼순", cookieManager.getCookie(request, "myName"));
    }

    @Test
    void 쿠키_저장하기() {
        cookieManager.setCookie(response, "myName", "김삼순", "/", "localhost");
        Assertions.assertEquals("김삼순", response.getCookie("myName").getValue());
    }

    @Test
    void 쿠키_삭제하기() {
        request.setCookies(new Cookie("myName", "김삼순"));
        cookieManager.deleteCookie(response, "myName");
        Assertions.assertNull(response.getCookie("myName").getValue());
    }
}
