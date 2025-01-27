package org.ftclub.cabinet.config.security;

import io.jsonwebtoken.Claims;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.service.TokenValidator;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final String BEARER = "Bearer ";
	private final TokenValidator tokenValidator;

	/**
	 * JWT에 대한 검증을 진행한 후, contextHolder에 유저에 대한 정보를 저장합니다.
	 *
	 * @param request
	 * @param response
	 * @param filterChain
	 * @throws ServletException
	 * @throws IOException
	 */
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {

		try {
			String accessToken = extractToken(request);
			Claims claims = tokenValidator.parseToken(accessToken);
			updateSecurityContextHolder(claims);
		} catch (Exception e) {

		}
		filterChain.doFilter(request, response);
	}

	private String extractToken(HttpServletRequest request) {
		String header = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (header == null || !header.startsWith(BEARER)) {
			throw ExceptionStatus.NOT_FOUND_JWT_TOKEN.asSpringSecurityException();
		}
		return header.substring(BEARER.length());
	}

	// userId, role
	private void updateSecurityContextHolder(Claims claims) {

		UserInfoDto userInfoDto =
				new UserInfoDto(
						claims.get("userId", Long.class),
						claims.get("roles", String.class)
				);
		List<String> roles = List.of(claims.get("roles", String.class).split(FtRole.DELIMITER));

		List<GrantedAuthority> authorityList = roles.stream()
				.map(role -> new SimpleGrantedAuthority(FtRole.ROLE + role))
				.collect(Collectors.toList());
		UsernamePasswordAuthenticationToken newAuth =
				new UsernamePasswordAuthenticationToken(userInfoDto, null, authorityList);
		SecurityContextHolder.getContext().setAuthentication(newAuth);
	}

}
