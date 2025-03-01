package org.ftclub.cabinet.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtExceptionFilter extends OncePerRequestFilter {

	private final ObjectMapper objectMapper;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
			FilterChain filterChain) throws IOException {
		ExceptionStatus exceptionStatus = null;
		try {
			filterChain.doFilter(request, response);

		} catch (ExpiredJwtException e) {
			log.error("Expired JWT Token : {}", e.getMessage());
			exceptionStatus = ExceptionStatus.JWT_EXPIRED;
		} catch (JwtException e) {
			log.error("Illegal JWT Token : {}", e.getMessage());
			exceptionStatus = ExceptionStatus.JWT_INVALID;
		} catch (Exception e) {
			log.error("JWT Authentication failed: {}", e.getMessage(), e);
			exceptionStatus = ExceptionStatus.JWT_EXCEPTION;

		} finally {
			if (exceptionStatus != null) {
				SecurityContextHolder.clearContext();
				sendErrorResponse(response, exceptionStatus);
			}
		}
	}

	private void sendErrorResponse(HttpServletResponse response, ExceptionStatus exceptionStatus)
			throws IOException {
		response.setStatus(exceptionStatus.getStatusCode());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding("UTF-8");

		Map<String, Object> errorResponse = new HashMap<>();
		errorResponse.put("status", exceptionStatus.getStatusCode());
		errorResponse.put("error", exceptionStatus.getError());
		errorResponse.put("message", exceptionStatus.getMessage());
		errorResponse.put("timestamp", Instant.now().toString());

		objectMapper.writeValue(response.getWriter(), errorResponse);
	}
}
