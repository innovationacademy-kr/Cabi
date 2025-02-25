package org.ftclub.cabinet.config.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import java.io.IOException;
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
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.ftclub.cabinet.exception.CustomAccessDeniedException;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserCommandService;
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
	private final CookieManager cookieManager;
	private final OauthService oauthService;
	private final ObjectMapper objectMapper;
	private final AuthPolicyService authPolicyService;
	private final UserQueryService userQueryService;
	private final UserCommandService userCommandService;
	private final JwtTokenProperties jwtTokenProperties;

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
					tokenProvider.createTokens(user.getId(), user.getRoles(), provider);
			setTokensToResponse(tokenDto, response);
		} else if (provider.equals(googleProvider)) {
			String googleEmail = fromLoadUser.getEmail();
			// 이미 연동한 계정이라면 토큰 발급, main페이지로 ㄱㄱ
			Optional<User> userByOauthMail = userQueryService.findByOauthEmail(googleEmail);

			// 최초 연동 -> 쿠키에서 JWT 추출 후 userPK
			if (userByOauthMail.isEmpty()) {
				UserInfoDto prevLoginStatus = getPrevLoginStatusByCookie(request);

				if (!prevLoginStatus.getOauth().equals(ftProvider)) {
					throw new CustomAuthenticationException(ExceptionStatus.NOT_FT_LOGIN_STATUS);
				}
				User user1 = userQueryService.getUser(prevLoginStatus.getUserId());
				userCommandService.updateOauthMail(user1, googleEmail);

				tokenProvider.createTokens(user1.getId(), user1.getRoles(), provider);
				Authentication linkedGoogleUser = getAuthenticationByLoadUser(user1, provider);
				SecurityContextHolder.getContext().setAuthentication(linkedGoogleUser);

				TokenDto tokenDto =
						tokenProvider.createTokens(user1.getId(), user1.getRoles(), provider);
				setTokensToResponse(tokenDto, response);
				redirectUrl = authPolicyService.getProfileUrl();
			}

			if (userByOauthMail.isPresent()) {
				User googleUser = userByOauthMail.get();
				Authentication googleAuth = getAuthenticationByLoadUser(googleUser, provider);
				SecurityContextHolder.getContext().setAuthentication(googleAuth);

				TokenDto token = tokenProvider.createTokens(googleUser.getId(),
						googleUser.getRoles(), provider);
				setTokensToResponse(token, response);
			}
		} else {
			throw new CustomAccessDeniedException(ExceptionStatus.NOT_SUPPORT_OAUTH_TYPE);
		}

		response.sendRedirect(redirectUrl);
	}

	private UserInfoDto getPrevLoginStatusByCookie(HttpServletRequest request) {
		String accessToken = cookieManager.getCookieValue(request, JwtTokenConstants.ACCESS_TOKEN);
		Claims claims = tokenProvider.parseToken(accessToken);

		Long userId = claims.get(JwtTokenConstants.USER_ID, Long.class);
		String prevOauth = claims.get(JwtTokenConstants.OAUTH, String.class);

		return UserInfoDto.builder()
				.userId(userId)
				.oauth(prevOauth)
				.build();
	}

	/**
	 * accessToken은 JSON, refreshToken 은 쿠키 형식으로 세팅.
	 *
	 * @param tokenDto
	 * @param response
	 */
	private void setTokensToResponse(TokenDto tokenDto, HttpServletResponse response) {
		Cookie accessTokenCookie = new Cookie(JwtTokenConstants.ACCESS_TOKEN,
				tokenDto.getAccessToken());
		accessTokenCookie.setSecure(true);
		accessTokenCookie.setMaxAge(jwtTokenProperties.getAccessExpirySeconds());
		accessTokenCookie.setPath("/");

		Cookie refreshTokenCookie = new Cookie(JwtTokenConstants.REFRESH_TOKEN,
				tokenDto.getRefreshToken());
		refreshTokenCookie.setHttpOnly(true);
		refreshTokenCookie.setMaxAge(jwtTokenProperties.getRefreshExpirySeconds());
		refreshTokenCookie.setPath("/");

		response.addCookie(accessTokenCookie);
		response.addCookie(refreshTokenCookie);
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
