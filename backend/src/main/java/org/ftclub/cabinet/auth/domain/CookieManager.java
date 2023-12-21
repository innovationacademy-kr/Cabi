package org.ftclub.cabinet.auth.domain;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 클라이언트의 쿠키를 관리하는 클래스입니다.
 */
@Component
@RequiredArgsConstructor
public class CookieManager {

	private final DomainProperties domainProperties;
	private final JwtProperties jwtProperties;

	/**
	 * 쿠키를 가져옵니다.
	 *
	 * @param req  요청 시의 서블렛 {@link HttpServletRequest}
	 * @param name 쿠키 이름
	 * @return 쿠키 값, 없는 경우 null
	 */
	public String getCookieValue(HttpServletRequest req, String name) {
		Cookie[] cookies = req.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(name)) {
					return cookie.getValue();
				}
			}
		}
		return null;
	}

	/**
	 * 쿠키를 설정합니다.
	 *
	 * @param res        요청 시의 서블렛 {@link HttpServletResponse}
	 * @param name       쿠키 이름
	 * @param value      쿠키 값
	 * @param path       쿠키 사용 경로
	 * @param serverName 쿠키 도메인
	 */
	public void setCookieToClient(HttpServletResponse res, Cookie cookie, String path,
	                              String serverName) {
		cookie.setMaxAge(60 * 60 * 24 * jwtProperties.getExpiryDays());
		cookie.setPath(path);
		if (serverName.equals(domainProperties.getLocal())) {
			cookie.setDomain(domainProperties.getLocal());
		} else {
			cookie.setDomain(domainProperties.getCookieDomain());
		}
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
	public void deleteCookie(HttpServletResponse res, String name) {
		Cookie cookie = new Cookie(name, null);
		cookie.setMaxAge(0);
		res.addCookie(cookie);
	}

	public Cookie cookieOf(String name, String value) {
		return new Cookie(name, value);
	}
}
