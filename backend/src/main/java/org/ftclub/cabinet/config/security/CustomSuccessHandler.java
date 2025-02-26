package org.ftclub.cabinet.config.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.ftclub.cabinet.auth.service.AuthenticationService;
import org.ftclub.cabinet.exception.CustomAccessDeniedException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
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


	private final OauthService oauthService;
	private final ObjectMapper objectMapper;
	private final AuthPolicyService authPolicyService;
	private final AuthenticationService authenticationService;

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
		String redirectUrl = authPolicyService.getMainHomeUrl();

		if (provider.equals(ftProvider)) {
			User user = oauthService.handleFtLogin(rootNode);
			authenticationService.processAuthentication(request, response, user, provider);

		} else if (isExternalProvider(provider)) {
			OauthResult result =
					oauthService.handleExternalOAuthLogin(fromLoadUser, request);
			authenticationService.processAuthentication(request, response, result.getUser(),
					provider);
			if (result.isRedirectionToProfile()) {
				redirectUrl = authPolicyService.getProfileUrl();
			}

		} else {
			throw new CustomAccessDeniedException(ExceptionStatus.NOT_SUPPORT_OAUTH_TYPE);
		}

		response.sendRedirect(redirectUrl);
	}

	private boolean isExternalProvider(String provider) {
		return provider.equals(ftProvider) ||
				provider.equals(googleProvider);
	}

}
