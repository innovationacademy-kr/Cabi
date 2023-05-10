package org.ftclub.cabinet.auth;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.DomainNameProperties;
import org.springframework.stereotype.Component;

/**
 * 클라이언트의 쿠키를 관리하는 클래스입니다.
 */
@Component
@RequiredArgsConstructor
public class CookieManager {

	private final DomainNameProperties domainNameProperties;

	/**
	 * 쿠키를 가져옵니다.
	 *
	 * @param req  요청 시의 서블렛 {@link HttpServletRequest}
	 * @param name 쿠키 이름
	 * @return 쿠키 값, 없는 경우 null
	 */
	public String getCookie(HttpServletRequest req, String name) {
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
	 * 쿠키가 존재하는지 확인합니다.
	 *
	 * @param req  요청 시의 서블렛 {@link HttpServletRequest}
	 * @param name 쿠키 이름
	 * @return 쿠키가 존재하는지 여부
	 */
	public boolean isCookieExists(HttpServletRequest req, String name) {
		return getCookie(req, name) != null;
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
	public void setCookie(HttpServletResponse res, String name, String value, String path,
			String serverName) {
		Cookie cookie = new Cookie(name, value);
		cookie.setMaxAge(60 * 60 * 24 * 28); // 28 days, jwt properties로 설정 가능
		cookie.setPath(path);
		if (serverName.equals(domainNameProperties.getLocal())) {
			cookie.setDomain(domainNameProperties.getLocal());
		} else {
			cookie.setDomain(domainNameProperties.getCookieDomain());
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
}
