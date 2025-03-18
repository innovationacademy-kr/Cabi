package org.ftclub.cabinet.security.filter;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.security.exception.SecurityExceptionHandlerManager;
import org.ftclub.cabinet.security.exception.SpringSecurityException;
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

		} catch (SpringSecurityException e) {
			log.info("[JWT Authentication failed] {} : {}",
					e.getStatus().getError(), e.getMessage());
			SecurityContextHolder.clearContext();
			securityExceptionHandlerManager.handle(response, e, false);
		} catch (Exception e) {
			log.info("Unexpected Error during JWT Authentication : {}", e.getMessage());
			if (log.isDebugEnabled()) {
				log.debug("Exception stack trace: ", e);
			}
			SecurityContextHolder.clearContext();
			securityExceptionHandlerManager.handle(response, e, false);
		}
	}
}
