package org.ftclub.cabinet.config.security;

import io.jsonwebtoken.Claims;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.web.filter.OncePerRequestFilter;

@RequiredArgsConstructor
@Slf4j
public class OAuth2CheckFilter extends OncePerRequestFilter {

	private final JwtTokenProvider tokenProvider;
	private final JwtTokenProvider jwtTokenProvider;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {

		log.info("start oauth check, = {}", request.getRequestURL());
		// 요청이 "/oauth2/authorization/google"이면 검사
		if (request.getRequestURI().equals("/oauth2/authorization/google")) {
			String token = jwtTokenProvider.extractToken(request);
			Claims claims = jwtTokenProvider.parseToken(token);
			if (!claims.get(JwtTokenProvider.OAUTH).equals("ft")) {
				throw new CustomAuthenticationException(ExceptionStatus.NOT_FT_LOGIN_STATUS);
			}
		}
		filterChain.doFilter(request, response);
	}
}
