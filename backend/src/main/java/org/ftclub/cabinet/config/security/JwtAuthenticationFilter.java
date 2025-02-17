package org.ftclub.cabinet.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
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
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;

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
		log.info("JwtAuthenticationFilter executing for request URL: {}", request.getRequestURL());
		try {
			String token = jwtTokenProvider.extractToken(request);
			log.info("Extracted Token = {}", token);
			if (token != null) {
				Claims claims = jwtTokenProvider.parseToken(token);
				Authentication auth = getAuthentication(claims);

				SecurityContextHolder.getContext().setAuthentication(auth);
			}

			filterChain.doFilter(request, response);
		} catch (ExpiredJwtException e) {
			throw new CustomAuthenticationException(ExceptionStatus.JWT_EXPIRED);
		} catch (SignatureException | MalformedJwtException | IllegalArgumentException e) {
			throw new CustomAuthenticationException(ExceptionStatus.JWT_INVALID);
		} catch (UnsupportedJwtException e) {
			throw new CustomAuthenticationException(ExceptionStatus.JWT_UNSUPPORTED);
		} catch (Exception e) {
			log.error("JWT Authentication failed: {}", e.getMessage(), e);
			throw new CustomAuthenticationException(ExceptionStatus.JWT_EXCEPTION);
		} finally {
			if (SecurityContextHolder.getContext().getAuthentication() == null) {
				SecurityContextHolder.clearContext();
			}
		}
	}

	// userId, role
	private Authentication getAuthentication(Claims claims) {
		String roles = claims.get("roles", String.class);

		UserInfoDto userInfoDto =
				new UserInfoDto(
						claims.get("userId", Long.class),
						roles
				);

		List<GrantedAuthority> authorityList = Stream.of(roles.split(FtRole.DELIMITER))
				.map(role -> new SimpleGrantedAuthority(FtRole.ROLE + role))
				.collect(Collectors.toList());
		return new UsernamePasswordAuthenticationToken(userInfoDto, null, authorityList);
	}

}
