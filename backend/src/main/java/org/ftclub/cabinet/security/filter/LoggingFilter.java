package org.ftclub.cabinet.security.filter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Log4j2
public class LoggingFilter extends OncePerRequestFilter {

	private static final List<String> IP_HEADERS = Arrays.asList("X-Forwarded-For",
			"Proxy-Client-IP", "WL-Proxy-Client-IP", "HTTP_CLIENT_IP", "HTTP_X_FORWARDED_FOR");

	@Override
	protected boolean shouldNotFilter(HttpServletRequest req) {
		String path = req.getRequestURI();
		return path.startsWith("/actuator/") || path.equals("/");
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {

		String requestURI = request.getRequestURI();
		String ipAddress = getClientIpAddr(request);

		try {
			filterChain.doFilter(request, response);
		} finally {
			log.debug("Response - IP: {}, URI: {}, Status: {}, Method : {}",
					ipAddress, requestURI, response.getStatus(), request.getMethod());
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
