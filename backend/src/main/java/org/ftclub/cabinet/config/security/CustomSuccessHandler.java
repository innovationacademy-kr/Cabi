package org.ftclub.cabinet.config.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.service.TokenProvider;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

/**
 * ft, google 로그인에 따라 유저 저장
 * <p>
 * token을 만들어 발급
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class CustomSuccessHandler implements AuthenticationSuccessHandler {


	private final JwtTokenProvider tokenProvider;
	private final OauthService oauthService;
	private final ObjectMapper objectMapper;
	@Value("${spring.security.oauth2.client.registration.ft.client-name}")
	private String ftProvider;
	@Value("${spring.security.oauth2.client.registration.google.client-name}")
	private String googleProvider;

	/**
	 * 로그인 이후 userPK, role 을 갖고 있는 토큰을 반환합니다.
	 *
	 * @param request
	 * @param response
	 * @param authentication
	 * @throws IOException
	 * @throws ServletException
	 */
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {

		CustomOauth2User fromLoadUser = (CustomOauth2User) authentication.getPrincipal();
		String provider = fromLoadUser.getProvider();

		JsonNode rootNode =
				objectMapper.convertValue(fromLoadUser.getAttributes(), JsonNode.class);

		User user;
		if (provider.equals(ftProvider)) {
			user = oauthService.handleFtLogin(rootNode);
		} else if (provider.equals(googleProvider)) {
			user = oauthService.handleGoogleLogin(rootNode, fromLoadUser);
		} else {
			throw new CustomAuthenticationException(ExceptionStatus.INVALID_OAUTH_TYPE);
		}

		updateSecurityContextHolder(user, provider);
		TokenDto tokenDto = tokenProvider.createTokenDto(user.getId(), user.getRoles());
		// AccessToken은 JSON, RefreshToken -> Cookie?
		setTokensToResponse(tokenDto, response);
	}

	/**
	 * accessToken은 JSON, refreshToken 은 쿠키 형식으로 세팅.
	 *
	 * @param tokenDto
	 * @param response
	 * @throws IOException
	 */
	private void setTokensToResponse(TokenDto tokenDto, HttpServletResponse response)
			throws IOException {
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding("UTF-8");
		Map<String, String> responseBody = new HashMap<>();
		responseBody.put(TokenProvider.USER_TOKEN_NAME, tokenDto.getAccessToken());
		new ObjectMapper().writeValue(response.getWriter(), responseBody);

		Cookie refreshTokenCookie = new Cookie("refreshToken", tokenDto.getRefreshToken());
		refreshTokenCookie.setHttpOnly(true);
		refreshTokenCookie.setSecure(true);
		refreshTokenCookie.setMaxAge((int) (JwtTokenProvider.refreshTokenValidMillisecond / 1000));
		refreshTokenCookie.setPath("/");

		response.addCookie(refreshTokenCookie);
	}

	/**
	 * google oauth로 로그인한 유저를 핸들링합니다.
	 *
	 * @param rootNode
	 * @return
	 */

	/**
	 * 42 oauth로 로그인한 유저를 핸들링합니다.
	 *
	 * @param rootNode
	 */


	/**
	 * user를 가지고 securityContextHolder 에 공통적으로 저장될 정보로 변환하고, 저장합니다.
	 * <p>
	 * Map.of -> null 값 허용 X
	 *
	 * @param user
	 * @param provider
	 */
	private void updateSecurityContextHolder(User user, String provider) {
		Map<String, Object> attribute = new HashMap<>();
		attribute.put("email", user.getEmail());
		attribute.put("roles", user.getRoles());
		attribute.put("blackholedAt", user.getBlackholedAt());

		CustomOauth2User updateUser = new CustomOauth2User(provider, user.getName(), attribute);
		List<String> roles = List.of(user.getRoles().split(FtRole.DELIMITER));

		List<GrantedAuthority> authorityList = roles.stream()
				.map(role -> new SimpleGrantedAuthority(FtRole.ROLE + role))
				.collect(Collectors.toList());

		UsernamePasswordAuthenticationToken newAuth =
				new UsernamePasswordAuthenticationToken(updateUser, null, authorityList);
		SecurityContextHolder.getContext().setAuthentication(newAuth);
	}
}
