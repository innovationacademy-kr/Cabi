package org.ftclub.cabinet.config.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.FtProfile;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.service.TokenProvider;
import org.ftclub.cabinet.auth.service.UserOauthService;
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
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

/**
 * ft, google 로그인에 따라 유저 저장
 * <p>
 * token을 만들어 발급
 */
@Slf4j
@RequiredArgsConstructor
public class CustomSuccessHandler implements AuthenticationSuccessHandler {


	private final TokenProvider tokenProvider;
	private final UserQueryService userQueryService;
	private final UserCommandService userCommandService;
	private final UserOauthService userOauthService;
	private final ObjectMapper objectMapper;
	@Value("${spring.security.oauth2.client.registration.ft.client-name}")
	private String ftProvider;
	@Value("${spring.security.oauth2.client.registration.google.client-name}")
	private String googleProvider;


	// 블랙홀 될 때 AGU, status 변경
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		CustomOauth2User fromLoadUser = (CustomOauth2User) authentication.getPrincipal();
		String provider = fromLoadUser.getProvider();
		JsonNode rootNode =
				objectMapper.convertValue(fromLoadUser.getAttributes(), JsonNode.class);
		// 42Oauth 로그인 -> 기존 유저라면 status update, 신규 유저라면 새로 만들기
		if (provider.equals(ftProvider)) {
			handleFtLogin(rootNode, provider, response);
		} else if (provider.equals(googleProvider)) {
			handleGoogleLogin(rootNode, provider, response);
			// 이후에 securityContextHolder에 들어갈 정보 다시 추리기
		} else {
			log.error("지원하지 않는 oauth 입니다.");
			throw ExceptionStatus.INVALID_AUTHORIZATION.asSpringSecurityException();
		}
	}

	private void handleGoogleLogin(JsonNode rootNode, String provider,
			HttpServletResponse response) {
		Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
		if (currentAuth == null
				|| !((currentAuth.getPrincipal()) instanceof CustomOauth2User)) {
			log.error("Google OAuth 요청 중, 42 OAuth 인증 상태가 유효하지 않습니다.");
			throw ExceptionStatus.INVALID_AUTHORIZATION.asSpringSecurityException();
		}

		CustomOauth2User ftUser = (CustomOauth2User) currentAuth.getPrincipal();
		if (!ftUser.getProvider().equals(ftProvider)) {
			log.error("Google OAuth 요청 중, 42 OAuth 인증 상태가 유효하지 않습니다.");
			throw ExceptionStatus.INVALID_AUTHORIZATION.asSpringSecurityException();
		}

		String oauthMail = rootNode.get("email").asText();
		Optional<User> userByOauthMail = userQueryService.findByOauthEmail(oauthMail);

		if (userByOauthMail.isPresent()) {
			log.error("Google의 메일 {}은 이미 다른 사용자{}와 연동되어 있습니다",
					oauthMail, userByOauthMail.get().getName());
			throw ExceptionStatus.INVALID_AUTHORIZATION.asSpringSecurityException();
		}
		// ftUser, google email 갖고 연동하기
		userCommandService.linkOauthAccount(ftUser.getName(), oauthMail);

		User user = userQueryService.getUserByName(ftUser.getName());
		updateSecurityContextHolder(user, provider, user.getRole());

		String accessToken = tokenProvider.createUserToken(user, LocalDateTime.now());
		response.addHeader("Authorization", "Bearer " + accessToken);
	}

	/**
	 * 42 oauth로 로그인한 유저에 대해 contextHolder 에 저장할 객체를 생성합니다.
	 *
	 * @param rootNode
	 * @param response
	 */
	private void handleFtLogin(JsonNode rootNode, String provider, HttpServletResponse response)
			throws JsonProcessingException {
		FtProfile profile = userOauthService.convertJsonStringToProfile(rootNode);
		FtRole role = profile.getRole();
		LocalDateTime blackHoledAt = profile.getBlackHoledAt();

		User user = userQueryService.findUser(profile.getIntraName())
				.orElseGet(() -> userCommandService.createUserByFtProfile(profile));

		// role, blackholedAt 검수
		if (!user.isSameBlackholedAtAndRole(profile.getBlackHoledAt(), role)) {
			userCommandService.updateUserBlackholeAndRole(user.getId(), blackHoledAt, role);
		}

		updateSecurityContextHolder(user, provider, role);
		String accessToken = tokenProvider.createUserToken(user, LocalDateTime.now());
		response.addHeader("Authorization", "Bearer " + accessToken);
	}

	/**
	 * user를 가지고 securityContextHolder 에 공통적으로 저장될 정보로 변환하고, 저장합니다.
	 *
	 * @param user
	 * @param provider
	 * @param role
	 */
	private void updateSecurityContextHolder(User user, String provider, FtRole role) {
		Map<String, Object> attribute = Map.of(
				"email", user.getEmail(),
				"role", user.getRole(),
				"blackholedAt", user.getBlackholedAt()
		);

		CustomOauth2User updateUser = new CustomOauth2User(provider, user.getName(), attribute);
		List<GrantedAuthority> authorityList =
				List.of(new SimpleGrantedAuthority(role.getAuthority()));
		UsernamePasswordAuthenticationToken newAuth =
				new UsernamePasswordAuthenticationToken(updateUser, null, authorityList);
		SecurityContextHolder.getContext().setAuthentication(newAuth);
	}
}
