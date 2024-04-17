package org.ftclub.cabinet.auth.filter;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.util.ContentCachingRequestWrapper;

@Component
public class CachingRequestBodyFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
			FilterChain filterChain)
			throws ServletException, IOException {
		HttpServletRequest wrappedRequest = new ContentCachingRequestWrapper(request);
		filterChain.doFilter(wrappedRequest, response);
	}
}
