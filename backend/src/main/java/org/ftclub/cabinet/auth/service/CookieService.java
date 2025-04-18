package org.ftclub.cabinet.auth.service;

import java.util.Arrays;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.CookieInfo;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.jwt.domain.JwtTokenProperties;
import org.springframework.stereotype.Service;

/**
 * cookieManager 의 기본적인 기능을 사용,
 * <p>
 * 비즈니스 로직을 더해 처리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CookieService {

	private static final String LOGIN_SOURCE = "login_source";
	private final CookieManager cookieManager;
	private final JwtTokenProperties jwtTokenProperties;

	public void setToClient(Cookie cookie, CookieInfo cookieInfo, HttpServletResponse res) {
		boolean isLocal = cookieManager.isLocalEnvironment(cookieInfo.getServerName());

		cookie.setPath("/");
		cookie.setSecure(!isLocal);
		cookie.setHttpOnly(cookieInfo.isHttpOnly());
		cookie.setMaxAge(cookieInfo.getMaxAge());
		cookieManager.setDomainByEnv(cookie, cookieInfo.getServerName());

		res.addCookie(cookie);
	}

	public void addAdminCookie(HttpServletRequest req, HttpServletResponse res) {
		Cookie cookie = new Cookie(LOGIN_SOURCE, "admin");
		CookieInfo cookieInfo = new CookieInfo(req.getServerName(), 60, true);
		setToClient(cookie, cookieInfo, res);
	}

	public void setAccessTokenCookiesToClient(HttpServletResponse res, TokenDto tokens,
			String serverName) {

		boolean isSecure = !cookieManager.isLocalEnvironment(serverName);

		Cookie accessTokenCookie = cookieManager.createCookie(
				JwtTokenConstants.ACCESS_TOKEN,
				tokens.getAccessToken(),
				jwtTokenProperties.getAccessExpirySeconds() + 180,
				"/",
				false,
				isSecure
		);
		cookieManager.setDomainByEnv(accessTokenCookie, serverName);
		res.addCookie(accessTokenCookie);
	}

	/**
	 * Csrf 쿠키를 제외한 모든 쿠키를 제거합니다.
	 *
	 * @param cookies
	 * @param serverName
	 * @param res
	 */
	public void deleteAllCookies(Cookie[] cookies, String serverName, HttpServletResponse res) {
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				cookieManager.deleteCookie(res, serverName, cookie.getName());
			}
		}
	}

	public String getCookieValue(HttpServletRequest req, String name) {
		Cookie[] cookies = req.getCookies();
		if (cookies == null) {
			return null;
		}
		return Arrays.stream(cookies)
				.filter(c -> c.getName().equals(name))
				.map(Cookie::getValue)
				.findFirst()
				.orElse(null);
	}
}
