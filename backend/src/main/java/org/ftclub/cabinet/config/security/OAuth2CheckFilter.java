package org.ftclub.cabinet.config.security;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class OAuth2CheckFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {
		
		// 요청이 "/oauth2/authorization/google"이면 검사
		if (request.getRequestURI().equals("/oauth2/authorization/google")) {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

			// 로그인 정보가 없거나, provider가 "ft"가 아니면 요청 차단
			if (authentication == null
					|| !(authentication.getPrincipal() instanceof CustomOauth2User)) {
				throw new CustomAuthenticationException(ExceptionStatus.NOT_FT_LOGIN_STATUS);
			}

			CustomOauth2User user = (CustomOauth2User) authentication.getPrincipal();
			if (!"ft".equals(user.getProvider())) {
				throw new CustomAuthenticationException(ExceptionStatus.NOT_FT_LOGIN_STATUS);
			}
		}
		filterChain.doFilter(request, response);
	}
}
