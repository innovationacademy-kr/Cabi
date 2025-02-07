package org.ftclub.cabinet.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.service.TokenValidator;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.JwtAuthenticationException;
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
	 * <p>
	 * 기존 토큰에 있는 정보 : userId, roles
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
			filterChain.doFilter(request, response);
		} catch (ExpiredJwtException e) {
			throw new JwtAuthenticationException(ExceptionStatus.JWT_EXPIRED);
		} catch (SignatureException | MalformedJwtException e) {
			throw new JwtAuthenticationException(ExceptionStatus.JWT_INVALID);
		} catch (Exception e) {
			log.error("JWT Authentication failed: {}", e.getMessage(), e);
			throw new JwtAuthenticationException(ExceptionStatus.JWT_EXCEPTION);
		} finally {
			if (SecurityContextHolder.getContext().getAuthentication() == null) {
				SecurityContextHolder.clearContext();
			}
		}
	}

	private String extractToken(HttpServletRequest request) {
		String header = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (header == null || !header.startsWith(BEARER)) {
			throw new JwtAuthenticationException(ExceptionStatus.JWT_TOKEN_NOT_FOUND);
		}
		return header.substring(BEARER.length());
	}

	// userId, role
	private void updateSecurityContextHolder(Claims claims) {
		String roles = claims.get("roles", String.class);

		UserInfoDto userInfoDto =
				new UserInfoDto(
						claims.get("userId", Long.class),
						roles
				);

		List<GrantedAuthority> authorityList = Stream.of(roles.split(FtRole.DELIMITER))
				.map(role -> new SimpleGrantedAuthority(FtRole.ROLE + role))
				.collect(Collectors.toList());
		UsernamePasswordAuthenticationToken newAuth =
				new UsernamePasswordAuthenticationToken(userInfoDto, null, authorityList);
		SecurityContextHolder.getContext().setAuthentication(newAuth);
	}

}
