package org.ftclub.cabinet.config.security;

import io.jsonwebtoken.Claims;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		return request.getRequestURI().equals("/v5/jwt/reissue");
	}

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
		log.info("JWT Filter: 요청 URL = {}", request.getRequestURI());
		String token = jwtTokenProvider.extractToken(request);
		if (token != null) {
			Claims claims = jwtTokenProvider.parseValidToken(token);
			Authentication auth = getAuthentication(claims);
			SecurityContextHolder.getContext().setAuthentication(auth);
		}
		filterChain.doFilter(request, response);
	}

	// userId, role
	private Authentication getAuthentication(Claims claims) {
		String roles = claims.get(JwtTokenConstants.ROLES, String.class);

		UserInfoDto userInfoDto =
				new UserInfoDto(
						claims.get(JwtTokenConstants.USER_ID, Long.class),
						claims.get(JwtTokenConstants.OAUTH, String.class),
						roles
				);

		List<GrantedAuthority> authorityList = Stream.of(roles.split(FtRole.DELIMITER))
				.map(role -> new SimpleGrantedAuthority(FtRole.ROLE + role))
				.collect(Collectors.toList());
		return new UsernamePasswordAuthenticationToken(userInfoDto, null, authorityList);
	}

}
