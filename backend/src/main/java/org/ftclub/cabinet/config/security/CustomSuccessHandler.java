package org.ftclub.cabinet.config.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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


	private final TokenProvider tokenProvider;
	private final UserQueryService userQueryService;
	private final UserCommandService userCommandService;
	private final UserOauthService userOauthService;
	private final ObjectMapper objectMapper;
	@Value("${spring.security.oauth2.client.registration.ft.client-name}")
	private String ftProvider;
	@Value("${spring.security.oauth2.client.registration.google.client-name}")
	private String googleProvider;


	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		CustomOauth2User fromLoadUser = (CustomOauth2User) authentication.getPrincipal();
		String provider = fromLoadUser.getProvider();
		JsonNode rootNode =
				objectMapper.convertValue(fromLoadUser.getAttributes(), JsonNode.class);

		User user;
		if (provider.equals(ftProvider)) {
			user = handleFtLogin(rootNode);
		} else if (provider.equals(googleProvider)) {
			user = handleGoogleLogin(rootNode);
		} else {
			throw ExceptionStatus.INVALID_AUTHORIZATION.asSpringSecurityException();
		}

		updateSecurityContextHolder(user, provider);
		String accessToken = tokenProvider.createUserToken(user, provider, LocalDateTime.now());
		response.addHeader("Authorization", "Bearer " + accessToken);
	}

	/**
	 * google oauth로 로그인한 유저를 핸들링합니다.
	 *
	 * @param rootNode
	 * @return
	 */
	private User handleGoogleLogin(JsonNode rootNode) {
		Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
		if (currentAuth == null
				|| !((currentAuth.getPrincipal()) instanceof CustomOauth2User)) {
			log.error("Google OAuth 요청 중, 42 OAuth 인증 상태가 유효하지 않습니다.");
			throw ExceptionStatus.INVALID_OAUTH_TYPE.asSpringSecurityException();
		}

		CustomOauth2User ftUser = (CustomOauth2User) currentAuth.getPrincipal();
		if (!ftUser.getProvider().equals(ftProvider)) {
			log.error("Google OAuth 요청 중, 42 OAuth 인증 상태가 유효하지 않습니다.");
			throw ExceptionStatus.INVALID_OAUTH_TYPE.asSpringSecurityException();
		}

		String oauthMail = rootNode.get("email").asText();
		Optional<User> userByOauthMail = userQueryService.findByOauthEmail(oauthMail);

		if (userByOauthMail.isPresent()) {
			log.error("Google의 메일 {}은 이미 다른 사용자{}와 연동되어 있습니다",
					oauthMail, userByOauthMail.get().getName());
			throw ExceptionStatus.DUPLICATED_OAUTH_MAIL.asSpringSecurityException();
		}
		// ftUser, google email 갖고 연동하기
		return userCommandService.linkOauthAccount(ftUser.getName(), oauthMail);
	}

	/**
	 * 42 oauth로 로그인한 유저를 핸들링합니다.
	 *
	 * @param rootNode
	 */
	private User handleFtLogin(JsonNode rootNode)
			throws JsonProcessingException {
		FtOauthProfile profile = userOauthService.convertJsonNodeToProfile(rootNode);
		List<FtRole> roles = profile.getRoles();
		String combinedRoles = FtRole.combineRolesToSTring(roles);

		LocalDateTime blackHoledAt = profile.getBlackHoledAt();

		User user = userQueryService.findUser(profile.getIntraName())
				.orElseGet(() -> userCommandService.createUserByFtOauthProfile(profile));

		// role, blackholedAt 검수
		if (!user.isSameBlackHoledAtAndRole(profile.getBlackHoledAt(), combinedRoles)) {
			userCommandService.updateUserBlackholeAndRole(user.getId(), blackHoledAt,
					combinedRoles);
		}
		return user;
	}

	/**
	 * user를 가지고 securityContextHolder 에 공통적으로 저장될 정보로 변환하고, 저장합니다.
	 *
	 * @param user
	 * @param provider
	 */
	private void updateSecurityContextHolder(User user, String provider) {
		Map<String, Object> attribute = Map.of(
				"email", user.getEmail(),
				"roles", user.getRoles(),
				"blackholedAt", user.getBlackholedAt()
		);

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
