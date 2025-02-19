package org.ftclub.cabinet.config.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

/**
 * ft, google 로그인에 따라 유저 저장
 * <p>
 * token을 만들어 발급
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {


	private final JwtTokenProvider tokenProvider;
	private final OauthService oauthService;
	private final ObjectMapper objectMapper;
	private final AuthPolicyService authPolicyService;
	private final UserQueryService userQueryService;
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
	 */
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException {

		CustomOauth2User fromLoadUser = (CustomOauth2User) authentication.getPrincipal();
		String provider = fromLoadUser.getProvider();
		JsonNode rootNode =
				objectMapper.convertValue(fromLoadUser.getAttributes(), JsonNode.class);

		User user;
		String redirectUrl = authPolicyService.getMainHomeUrl();
		if (provider.equals(ftProvider)) {
			user = oauthService.handleFtLogin(rootNode);
			Authentication newAuth = getAuthenticationByLoadUser(user, provider);
			SecurityContextHolder.getContext().setAuthentication(newAuth);
			TokenDto tokenDto =
					tokenProvider.createTokenDto(user.getId(), user.getRoles(), provider);
			setTokensToResponse(tokenDto, response);
		} else if (provider.equals(googleProvider)) {
			String googleEmail = fromLoadUser.getEmail();
			// 이미 연동한 계정이라면 토큰 발급, main페이지로 ㄱㄱ
			// 없는 계정이라면 redirect만 ㄱㄱ
			Optional<User> userByOauthMail = userQueryService.findByOauthEmail(googleEmail);
			if (userByOauthMail.isEmpty()) {
				redirectUrl = authPolicyService.getProfileUrl() + "?oauthMail=" + URLEncoder.encode(
						googleEmail, StandardCharsets.UTF_8);
			}
			if (userByOauthMail.isPresent()) {
				User googleUser = userByOauthMail.get();
				Authentication googleAuth = getAuthenticationByLoadUser(googleUser, provider);
				SecurityContextHolder.getContext().setAuthentication(googleAuth);

				TokenDto token = tokenProvider.createTokenDto(googleUser.getId(),
						googleUser.getRoles(), provider);
				setTokensToResponse(token, response);
			}
		} else {
			throw new CustomAuthenticationException(ExceptionStatus.NOT_SUPPORT_OAUTH_TYPE);
		}

		response.sendRedirect(redirectUrl);
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
		Cookie accessTokenCookie = new Cookie("access_token", tokenDto.getAccessToken());
//		accessTokenCookie.setHttpOnly(true);
		accessTokenCookie.setSecure(true);
		accessTokenCookie.setMaxAge((int) (JwtTokenProvider.accessTokenValidMillisecond / 1000));
		accessTokenCookie.setPath("/");

		response.addCookie(accessTokenCookie);
	}

	/**
	 * user를 가지고 securityContextHolder 에 공통적으로 저장될 정보로 변환하고, 저장합니다.
	 * <p>
	 * Map.of -> null 값 허용 X
	 *
	 * @param user
	 * @param provider
	 */
	private Authentication getAuthenticationByLoadUser(User user, String provider) {
		Map<String, Object> attribute = new HashMap<>();
		attribute.put("email", user.getEmail());
		attribute.put("roles", user.getRoles());
		attribute.put("blackholedAt", user.getBlackholedAt());

		List<String> roles = List.of(user.getRoles().split(FtRole.DELIMITER));

		List<GrantedAuthority> authorityList = roles.stream()
				.map(role -> new SimpleGrantedAuthority(FtRole.ROLE + role))
				.collect(Collectors.toList());

		CustomOauth2User updateUser =
				new CustomOauth2User(provider, user.getName(), attribute, authorityList);
		return new UsernamePasswordAuthenticationToken(updateUser, null, authorityList);
	}
}
