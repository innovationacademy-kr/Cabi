package org.ftclub.cabinet.config.security.filter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Slf4j
public class LoggingFilter extends OncePerRequestFilter {

	private static final List<String> IP_HEADERS = Arrays.asList("X-Forwarded-For",
			"Proxy-Client-IP", "WL-Proxy-Client-IP", "HTTP_CLIENT_IP", "HTTP_X_FORWARDED_FOR");

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {

		String requestURI = request.getRequestURI();
		String ipAddress = getClientIpAddr(request);

		try {
			filterChain.doFilter(request, response);
		} finally {
			log.debug("Response - IP: {}, URI: {}, Status: {}",
					ipAddress, requestURI, response.getStatus());
		}
	}

	private String getClientIpAddr(HttpServletRequest request) {
		return IP_HEADERS.stream()
				.map(request::getHeader)
				.filter(Objects::nonNull)
				.filter(ip -> !ip.isEmpty() && !ip.equalsIgnoreCase("unknown"))
				.findFirst()
				.orElseGet(request::getRemoteAddr);
	}
}
