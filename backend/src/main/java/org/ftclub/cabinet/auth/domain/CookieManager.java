package org.ftclub.cabinet.auth.domain;

import java.util.Arrays;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.DomainProperties;
import org.springframework.stereotype.Component;

/**
 * 클라이언트의 쿠키를 관리하는 클래스입니다.
 */
@Component
@RequiredArgsConstructor
public class CookieManager {

	private final DomainProperties domainProperties;

	/**
	 * 쿠키를 가져옵니다.
	 *
	 * @param req  요청 시의 서블렛 {@link HttpServletRequest}
	 * @param name 쿠키 이름
	 * @return 쿠키 값, 없는 경우 null
	 */
	public String getCookieValue(HttpServletRequest req, String name) {
		Cookie[] cookies = req.getCookies();

		return Arrays.stream(cookies)
				.filter(c -> c.getName().equals(name))
				.map(Cookie::getValue)
				.findFirst()
				.orElse(null);
	}

	public void deleteCookie(HttpServletResponse res, String name) {
		Cookie cookie = new Cookie(name, null);
		cookie.setMaxAge(0);
		cookie.setPath("/");

		res.addCookie(cookie);
	}

	/**
	 * 쿠키를 삭제합니다.
	 * <p>
	 * 해당 쿠키의 만료시간을 0으로 설정하는 방식으로 삭제합니다.
	 *
	 * @param res  요청 시의 서블렛 {@link HttpServletResponse}
	 * @param name 쿠키 이름
	 */
	public void deleteCookie(HttpServletResponse res, String serverName, String name) {
		Cookie cookie = new Cookie(name, null);
		cookie.setMaxAge(0);
		cookie.setPath("/");
		if (isLocalEnvironment(serverName)) {
			cookie.setDomain(domainProperties.getLocal());
		} else {
			cookie.setDomain(domainProperties.getCookieDomain());
		}
		res.addCookie(cookie);
	}

	public Cookie createCookie(String name, String value, int maxAge, String path,
			boolean isHttpOnly, boolean isSecure) {
		Cookie cookie = new Cookie(name, value);

		cookie.setMaxAge(maxAge);
		cookie.setPath(path);
		cookie.setHttpOnly(isHttpOnly);
		cookie.setSecure(isSecure);
		return cookie;
	}

	public boolean isLocalEnvironment(String serverName) {
		return serverName.equals(domainProperties.getLocal());
	}

	public void setDomainByEnv(Cookie cookie, String serverName) {
		if (isLocalEnvironment(serverName)) {
			cookie.setDomain(domainProperties.getLocal());
		} else {
			cookie.setDomain(domainProperties.getCookieDomain());
		}
	}
}
