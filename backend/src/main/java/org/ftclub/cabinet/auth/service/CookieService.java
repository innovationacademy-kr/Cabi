package org.ftclub.cabinet.auth.service;

import java.util.Arrays;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.CookieInfo;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.config.security.CsrfCookieConfig;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.jwt.domain.JwtTokenProperties;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CookieService {

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

	public void setTokenCookies(HttpServletResponse res, TokenDto tokens, String serverName) {

		boolean isSecure = !cookieManager.isLocalEnvironment(serverName);

		Cookie accessTokenCookie = cookieManager.createCookie(
				JwtTokenConstants.ACCESS_TOKEN,
				tokens.getAccessToken(),
				jwtTokenProperties.getAccessExpirySeconds(),
				"/",
				false,
				isSecure
		);
		cookieManager.setDomainAndAddCookie(res, serverName, accessTokenCookie);

		Cookie refreshTokenCookie = cookieManager.createCookie(
				JwtTokenConstants.REFRESH_TOKEN,
				tokens.getRefreshToken(),
				jwtTokenProperties.getRefreshExpirySeconds(),
				"/",
				true,
				isSecure
		);

		cookieManager.setDomainAndAddCookie(res, serverName, refreshTokenCookie);
	}

	public void deleteAllCookies(Cookie[] cookies, String serverName, HttpServletResponse res) {
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (CsrfCookieConfig.CSRF_HEADER.equals(cookie.getName())) {
					cookieManager.deleteCookie(res, serverName, cookie.getName());
				}
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
