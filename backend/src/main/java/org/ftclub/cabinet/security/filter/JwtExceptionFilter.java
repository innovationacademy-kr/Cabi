package org.ftclub.cabinet.security.filter;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.security.exception.SecurityExceptionHandlerManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Jwt 관련 예외만 처리
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtExceptionFilter extends OncePerRequestFilter {

	private final SecurityExceptionHandlerManager securityExceptionHandlerManager;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
			FilterChain filterChain) throws IOException, ServletException {
		try {
			filterChain.doFilter(request, response);

		} catch (SecurityException e) {
			log.error("JWT Authentication failed: {}", e.getMessage(), e);
			SecurityContextHolder.clearContext();
			securityExceptionHandlerManager.handle(response, e, false);
		}
	}
}
