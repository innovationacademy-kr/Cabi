package org.ftclub.cabinet.security.filter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Log4j2
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtService jwtService;

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		return request.getRequestURI().equals("/jwt/reissue");
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
		String token = jwtService.extractToken(request);
		if (token != null) {
			UserInfoDto userInfoDto = jwtService.validateTokenAndGetUserInfo(token);
			Authentication auth = getAuthentication(userInfoDto);

			log.debug("JWT Filter: userId = {}, role = {}",
					userInfoDto.getUserId(),
					userInfoDto.getRoles()
			);
			SecurityContextHolder.getContext().setAuthentication(auth);
		}
		filterChain.doFilter(request, response);
	}

	private Authentication getAuthentication(UserInfoDto dto) {
		String roles = dto.getRoles();

		List<GrantedAuthority> authorityList = Stream.of(roles.split(FtRole.DELIMITER))
				.map(role -> new SimpleGrantedAuthority(FtRole.ROLE + role))
				.collect(Collectors.toList());
		return new UsernamePasswordAuthenticationToken(dto, null, authorityList);
	}

}
