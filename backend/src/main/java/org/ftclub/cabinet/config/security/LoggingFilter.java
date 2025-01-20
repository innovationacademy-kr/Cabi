package org.ftclub.cabinet.config.security;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Slf4j
public class LoggingFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String requestURI = request.getRequestURI();
		String userName = (authentication != null) ? authentication.getName() : "anonymous";
		String ipAddress = request.getRemoteAddr();

		log.info("Request URL: {}, UserName: {}, IP: {}", requestURI, userName, ipAddress);

		filterChain.doFilter(request, response);
	}
}
