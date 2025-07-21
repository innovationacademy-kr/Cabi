package org.ftclub.cabinet.auth.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import javax.servlet.http.Cookie;
import org.ftclub.cabinet.auth.service.CookieService;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.jwt.domain.JwtTokenProperties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

@ExtendWith(MockitoExtension.class)
public class CookieManagerUnitTest {

	@Mock
	DomainProperties domainProperties = mock(DomainProperties.class);

	@Mock
	JwtTokenProperties jwtProperties = mock(JwtTokenProperties.class);

	@InjectMocks
	CookieService cookieService;

	MockHttpServletRequest request = new MockHttpServletRequest();

	MockHttpServletResponse response = new MockHttpServletResponse();

	@Test
	@DisplayName("성공 - key가 일치하는 쿠키가 있을 때")
	void 성공_getCookie() {
		Cookie expect = new Cookie("name", "value");
		request.setCookies(expect);

		String result = cookieService.getCookieValue(request, "name");

		assertEquals(expect.getValue(), result);
	}

	@Test
	@DisplayName("실패 - key가 일치하는 쿠키가 없을 때")
	void 실패_getCookie() {
		Cookie expect = new Cookie("name", "value");
		request.setCookies(expect);

		String result = cookieService.getCookieValue(request, "name2");

		assertNull(result);
	}

	@Test
	@DisplayName("성공: 도메인이 Local일 때")
	void 성공_setCookieToClient() {
		given(domainProperties.getLocal()).willReturn("local");
		given(jwtProperties.getAccessExpirySeconds()).willReturn(100);
		String serverName = domainProperties.getLocal();
		String path = "/";
		Cookie cookie = new Cookie("name", "value");
		CookieInfo cookieInfo = new CookieInfo(request.getServerName(),
				jwtProperties.getAccessExpirySeconds(), false);

		cookieService.setToClient(cookie, cookieInfo, response);

		assertEquals(jwtProperties.getAccessExpiry(), cookie.getMaxAge());
		assertEquals(path, cookie.getPath());
		assertEquals(domainProperties.getLocal(), cookie.getDomain());
		assertNotNull(response.getCookie("name"));
	}

	@Test
	@DisplayName("성공: 도메인이 Local이 아닌 다른 도메인일 때")
	void 성공_setCookieToClient2() {
		given(domainProperties.getLocal()).willReturn("local");
		given(domainProperties.getCookieDomain()).willReturn("cookie.domain.com");
		given(jwtProperties.getAccessExpirySeconds()).willReturn(100);
		String serverName = domainProperties.getCookieDomain();
		String path = "/";

		Cookie cookie = new Cookie("name", "value");
		CookieInfo cookieInfo = new CookieInfo(request.getServerName(),
				jwtProperties.getAccessExpirySeconds(), false);
		cookieService.setToClient(cookie, cookieInfo, response);

		assertEquals(jwtProperties.getAccessExpirySeconds(), cookie.getMaxAge());
		assertEquals(path, cookie.getPath());
		assertEquals(domainProperties.getCookieDomain(), cookie.getDomain());
		assertNotNull(response.getCookie("name"));
	}

	@Test
	@DisplayName("성공: 쿠키 지우기")
	void 성공_deleteCookie() {
		cookieService.deleteAllCookies(request.getCookies(), request.getServerName(), response);
		Cookie cookie = response.getCookie("name");

		assertEquals(0, cookie.getMaxAge());
		assertNull(cookie.getValue());
	}
}
