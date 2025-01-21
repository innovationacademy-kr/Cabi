package org.ftclub.cabinet.config.security;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.service.TokenProvider;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserCommandService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
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
	@Value("${spring.security.oauth2.client.registration.ft.client-name}")
	private String ftProvider;
	@Value("${spring.security.oauth2.client.registration.google.client-name}")
	private String googleProvider;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		CustomOauth2User profile = (CustomOauth2User) authentication.getPrincipal();
		// 42Oauth 로그인 -> 기존 유저라면 status update, 신규 유저라면 새로 만들기
		if (profile.getProvider().equals(ftProvider)) {
			handleFtLogin(profile, response);
		} else if (profile.getProvider().equals(googleProvider)) {
			handleGoogleLogin(profile, response);
			// 이후에 securityContextHolder에 들어갈 정보 다시 추리기
		} else {
			log.error("지원하지 않는 oauth 입니다.");
			throw ExceptionStatus.INVALID_AUTHORIZATION.asSpringSecurityException();
		}
	}

	// 블랙홀 될 때 AGU, status 변경
	private void handleGoogleLogin(CustomOauth2User profile, HttpServletResponse response) {
		Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
		// instance로 검수하지 말고, provider가 ft인 상태인지로 검수 ㄱㄱ
		if (currentAuth == null
				|| !((currentAuth.getPrincipal()) instanceof CustomOauth2User)) {
			log.error("Google OAuth 요청 중, 42 OAuth 인증 상태가 유효하지 않습니다.");
		}
		CustomOauth2User ftUser = (CustomOauth2User) currentAuth.getPrincipal();

		Optional<User> userByOauthMail = userQueryService.findByOauthEmail(profile.getEmail());
		if (userByOauthMail.isPresent()) {
			log.error("Google의 메일 {}은 이미 다른 사용자{}와 연동되어 있습니다",
					profile.getEmail(), userByOauthMail.get().getName());
			throw ExceptionStatus.INVALID_AUTHORIZATION.asSpringSecurityException();
		}
		// ftUser, google email 갖고 연동하기
		userCommandService.linkOauthAccount(ftUser.getName(), profile.getEmail());

		User user = userQueryService.getUserByName(ftUser.getName());
		String accessToken = tokenProvider.createUserToken(user, LocalDateTime.now());
		response.addHeader("Authorization", "Bearer " + accessToken);
	}

	private void handleFtLogin(CustomOauth2User profile, HttpServletResponse response) {
		LocalDateTime blackHoledAt = profile.getBlackHoledAt();
		FtRole role = profile.getRole();

		User user = userQueryService.findUser(profile.getName())
				.orElseGet(() -> userCommandService.createUserByOauthProfile(profile));

		// role, blackholedAt 검수
		if (!user.isSameBlackholedAtAndRole(blackHoledAt, role)) {
			userCommandService.updateUserBlackholeAndRole(user.getId(), blackHoledAt, role);
		}

		String accessToken = tokenProvider.createUserToken(user, LocalDateTime.now());
		response.addHeader("Authorization", "Bearer " + accessToken);
	}

}
