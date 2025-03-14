package org.ftclub.cabinet.config.security;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.CookieInfo;
import org.ftclub.cabinet.auth.service.CookieService;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRepository;

@Configuration
@RequiredArgsConstructor
public class CsrfCookieConfig implements CsrfTokenRepository {

	public static final String CSRF_HEADER = "XSRF-TOKEN";
	private final CookieCsrfTokenRepository delegate = CookieCsrfTokenRepository.withHttpOnlyFalse();
	private final CookieService cookieService;

	@Override
	public CsrfToken generateToken(HttpServletRequest request) {
		return delegate.generateToken(request);
	}

	@Override
	public void saveToken(CsrfToken token, HttpServletRequest request,
			HttpServletResponse response) {
		if (token == null) {
			delegate.saveToken(null, request, response);
			return;
		}

		Cookie csrfCookie = new Cookie(CSRF_HEADER, token.getToken());
		CookieInfo cookieInfo = new CookieInfo(request.getServerName(), -1, false);
		cookieService.setToClient(csrfCookie, cookieInfo, response);
	}

	@Override
	public CsrfToken loadToken(HttpServletRequest request) {
		return delegate.loadToken(request);
	}
}
