package org.ftclub.cabinet.auth.domain;

import java.util.Arrays;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.jwt.domain.JwtTokenProperties;
import org.springframework.stereotype.Component;

/**
 * 클라이언트의 쿠키를 관리하는 클래스입니다.
 */
@Component
@RequiredArgsConstructor
public class CookieManager {

	private final DomainProperties domainProperties;
	private final JwtProperties jwtProperties;
	private final JwtTokenProperties jwtTokenProperties;

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

	/**
	 * 쿠키를 설정합니다.
	 *
	 * @param res        요청 시의 서블렛 {@link HttpServletResponse}
	 * @param cookie     쿠키
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

	public void deleteCookie(HttpServletResponse res, String name) {
		Cookie cookie = new Cookie(name, null);
		cookie.setMaxAge(0);
		cookie.setPath("/");
		
		res.addCookie(cookie);
	}


	public Cookie cookieOf(String name, String value) {
		return new Cookie(name, value);
	}

	public void setTokenCookies(HttpServletResponse response, TokenDto tokens, String serverName) {
		Cookie accessTokenCookie =
				cookieOf(JwtTokenConstants.ACCESS_TOKEN, tokens.getAccessToken());
		accessTokenCookie.setMaxAge(jwtTokenProperties.getRefreshExpirySeconds());
		setSecureAndClient(response, accessTokenCookie, "/", serverName);

		// 리프레시 토큰 쿠키 설정
		Cookie refreshTokenCookie =
				cookieOf(JwtTokenConstants.REFRESH_TOKEN, tokens.getRefreshToken());
		refreshTokenCookie.setHttpOnly(true);
		refreshTokenCookie.setMaxAge(jwtTokenProperties.getRefreshExpirySeconds());
		setSecureAndClient(response, refreshTokenCookie, "/", serverName);
	}

	public void setSecureAndClient(HttpServletResponse res,
			Cookie cookie, String path,
			String serverName) {
		cookie.setPath(path);
		if (serverName.equals(domainProperties.getLocal())) {
			cookie.setDomain(domainProperties.getLocal());
		} else {
			cookie.setDomain(domainProperties.getCookieDomain());
			cookie.setSecure(true);
		}
		res.addCookie(cookie);
	}

	/*---------리뉴얼-----------*/

	public Cookie createCookie(String name, String value, int maxAge, String path,
			boolean isHttpOnly, boolean isSecure) {
		Cookie cookie = new Cookie(name, value);

		cookie.setMaxAge(maxAge);
		cookie.setPath(path);
		cookie.setHttpOnly(isHttpOnly);
		cookie.setSecure(isSecure);
		return cookie;
	}

	public void setDomainAndAddCookie(HttpServletResponse response, String serverName,
			Cookie cookie) {

		if (serverName.equals(domainProperties.getLocal())) {
			cookie.setDomain(domainProperties.getLocal());
		} else {
			cookie.setDomain(domainProperties.getCookieDomain());
		}
		response.addCookie(cookie);
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
