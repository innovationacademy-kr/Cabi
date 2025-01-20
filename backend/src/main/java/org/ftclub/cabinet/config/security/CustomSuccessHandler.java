package org.ftclub.cabinet.config.security;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.service.TokenProvider;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

/**
 * ft, google 로그인에 따라 유저 저장
 * <p>
 * token을 만들어 발급
 */
@RequiredArgsConstructor
public class CustomSuccessHandler implements AuthenticationSuccessHandler {


	private final TokenProvider tokenProvider;
	private final UserFacadeService userFacadeService;
	@Value("${spring.security.oauth2.client.registration.ft.client-name}")
	private String ftProvider;
	@Value("${spring.security.oauth2.client.registration.google.client-name}")
	private String googleProvider;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		CustomOauth2User user = (CustomOauth2User) authentication.getPrincipal();

		if (user.getProvider().equals(ftProvider)) {

		}
		if (user.getProvider().equals(googleProvider)) {
			
		}
	}

}
