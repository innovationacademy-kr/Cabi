package org.ftclub.cabinet.auth.domain;

import javax.servlet.http.Cookie;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

@SpringBootTest
public class CookieManagerTest {

	@Autowired
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
