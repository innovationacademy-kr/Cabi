package org.ftclub.cabinet.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {


	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException {

		ExceptionStatus exceptionStatus = ExceptionStatus.AUTHENTICATION_FAILED;
		log.error("Request Uri : {}", request.getRequestURI());

		Object exceptionStatusAttr = request.getAttribute("exceptionStatus");
		if (exceptionStatusAttr instanceof ExceptionStatus) {
			exceptionStatus = (ExceptionStatus) exceptionStatusAttr;
		}
		if (authException instanceof CustomAuthenticationException) {
			exceptionStatus = ((CustomAuthenticationException) authException).getStatus();
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
