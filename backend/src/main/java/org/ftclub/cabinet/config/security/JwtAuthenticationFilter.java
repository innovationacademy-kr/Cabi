package org.ftclub.cabinet.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import java.io.IOException;
import java.security.Key;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.JwtAuthenticationException;
import org.springframework.beans.factory.annotation.Value;
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
	@Value("${cabinet.jwt.jwt-secret-key}")
	private String secretKey;

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
			String token = extractToken(request);
			Claims claims = parseToken(token);
			updateSecurityContextHolder(claims);

			filterChain.doFilter(request, response);
		} catch (ExpiredJwtException e) {
			throw new JwtAuthenticationException(ExceptionStatus.JWT_EXPIRED);
		} catch (SignatureException | MalformedJwtException | IllegalArgumentException e) {
			throw new JwtAuthenticationException(ExceptionStatus.JWT_INVALID);
		} catch (UnsupportedJwtException e) {
			throw new JwtAuthenticationException(ExceptionStatus.JWT_UNSUPPORTED);
		} catch (Exception e) {
			log.error("JWT Authentication failed: {}", e.getMessage(), e);
			throw new JwtAuthenticationException(ExceptionStatus.JWT_EXCEPTION);
		} finally {
			if (SecurityContextHolder.getContext().getAuthentication() == null) {
				SecurityContextHolder.clearContext();
			}
		}
	}

	private Claims parseToken(String accessToken) {
		byte[] secretKeyBytes = DatatypeConverter.parseBase64Binary(secretKey);
		Key key = new SecretKeySpec(secretKeyBytes, SignatureAlgorithm.HS256.getJcaName());

		return Jwts.parserBuilder()
				.setSigningKey(key).build()
				.parseClaimsJws(accessToken)
				.getBody();
	}

	/**
	 * 헤더로부터 JWT가 있는지 검증합니다.
	 * <p>
	 * 추후 전체 공개 페이지가 있다면(공지사항 등..?) 예외처리 안하고 null 반환
	 *
	 * @param request
	 * @return
	 */
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
