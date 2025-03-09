package org.ftclub.cabinet.config.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.exception.CustomAccessDeniedException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
@Slf4j
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

	private final CookieManager cookieManager;

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
			AccessDeniedException accessDeniedException) throws IOException, ServletException {

		Cookie[] cookies = request.getCookies();
		cookieManager.deleteAllCookies(cookies, response);
		log.error("Request Method = {}", request.getMethod());
		ExceptionStatus exceptionStatus = ExceptionStatus.ACCESS_DENIED;
		log.error("Request Uri : {}", request.getRequestURI());
		log.error("Access Denied! Authentication: {}",
				SecurityContextHolder.getContext().getAuthentication());
		if (accessDeniedException instanceof CustomAccessDeniedException) {
			exceptionStatus = ((CustomAccessDeniedException) accessDeniedException).getStatus();
		}
		response.setStatus(exceptionStatus.getStatusCode());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding("UTF-8");

		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("status", exceptionStatus.getStatusCode());
		responseBody.put("error", exceptionStatus.getError());
		responseBody.put("message", exceptionStatus.getMessage());
		responseBody.put("timestamp", Instant.now().toString());

		new ObjectMapper().writeValue(response.getWriter(), responseBody);
	}
}
