package org.ftclub.cabinet.config.security;

import java.io.IOException;
import java.time.LocalDateTime;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.auth.service.TokenProvider;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserCommandService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
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
		// 구글 -> 처음이면 user에 저장,
		// 기존 유저라면 role, blackhole 업데이트
		if (profile.getProvider().equals(ftProvider)) {
			LocalDateTime blackHoledAt = profile.getBlackHoledAt();
			FtRole role = profile.getRole();

			User user = userQueryService.findUser(profile.getUserId())
					.orElseGet(() -> userCommandService.createUserByOauthProfile(profile));

			// role, blackholedAt 검수
			if (!user.isSameBlackholedAtAndRole(blackHoledAt, role)) {
				userCommandService.updateUserBlackholeAndRole(user.getId(), blackHoledAt, role);
			}

			String accessToken = tokenProvider.createUserToken(user, LocalDateTime.now());
			response.addHeader("Authorization", "Bearer " + accessToken);
		}
		// credential 에서 찾고, 있으면 이미 연동 에러 반환
		// 아니라면 계정 연동 진행
		if (profile.getProvider().equals(googleProvider)) {

		}
		// provider가 첨보는 애면 에러 반환

	}

}
