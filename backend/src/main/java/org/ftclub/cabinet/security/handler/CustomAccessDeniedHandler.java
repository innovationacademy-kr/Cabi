package org.ftclub.cabinet.security.handler;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.service.CookieService;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.security.exception.SecurityExceptionHandlerManager;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
@Slf4j
@Logging
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

	private final CookieService cookieService;
	private final SecurityExceptionHandlerManager securityExceptionHandlerManager;

	/**
	 * Security 내부에서 403 에러 발생 시, Spring은 기본 오류 페이지를 응답합니다.
	 * <p>
	 * 이를 대체하여 기존에 작성한 ExceptionStatus를 반환하도록 합니다.
	 *
	 * @param request
	 * @param response
	 * @param accessDeniedException
	 * @throws IOException
	 * @throws ServletException
	 */
	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
			AccessDeniedException accessDeniedException) {

		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				log.info("Cookie Name = {}, domain = {}, path = {}, secure = {}",
						cookie.getName(), cookie.getDomain(), cookie.getPath(), cookie.getSecure());
			}
			cookieService.deleteAllCookies(cookies, request.getServerName(), response);
		}
		securityExceptionHandlerManager.handle(response, accessDeniedException, false);
	}
}
