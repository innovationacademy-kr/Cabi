package org.ftclub.cabinet.security.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.CustomOAuth2User;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.auth.service.AuthFacadeService;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.ftclub.cabinet.auth.service.OauthFacadeService;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.security.exception.SecurityExceptionHandlerManager;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

/**
 * ft, google 로그인에 따라 유저 저장
 * <p>
 * token을 만들어 발급
 */
@Component
@Logging
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private final OauthFacadeService oauthFacadeService;
	private final ObjectMapper objectMapper;
	private final AuthPolicyService authPolicyService;
	private final AuthFacadeService authFacadeService;
	private final SecurityExceptionHandlerManager securityExceptionHandlerManager;
	@Value("${spring.security.oauth2.client.registration.ft.client-name}")
	private String mainProvider;

	/**
	 * oauth2 로그인 성공 후, role에 맞는 인가 부여 및 토큰을 발행합니다.
	 *
	 * @param request
	 * @param response
	 * @param authentication
	 * @throws IOException
	 */
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException {
		CustomOAuth2User fromLoadUser = (CustomOAuth2User) authentication.getPrincipal();

		try {
			OauthResult oauthResult = processOAuthLogin(request, fromLoadUser);
			authFacadeService.processAuthentication(request, response, oauthResult,
					fromLoadUser.getProvider());

			redirectUser(response, oauthResult);
		} catch (Exception e) {
			SecurityContextHolder.clearContext();
			securityExceptionHandlerManager.handle(response, e, true);
		}
	}

	/**
	 * oauth2 login 위치에 따라 OauthResult 생성
	 *
	 * @param req
	 * @param oauth2User
	 * @return
	 */
	private OauthResult processOAuthLogin(
			HttpServletRequest req,
			CustomOAuth2User oauth2User) {

		String provider = oauth2User.getProvider();
		if (provider.equals(mainProvider)) {
			JsonNode rootNode =
					objectMapper.convertValue(oauth2User.getAttributes(), JsonNode.class);

			return oauthFacadeService.handleFtLogin(rootNode);
		}
		return oauthFacadeService.handleExternalOAuthLogin(oauth2User, req);
	}

	private void redirectUser(HttpServletResponse response, OauthResult oauthResult)
			throws IOException {
		String redirectUrl = oauthResult.hasRole("AGU")
				? authPolicyService.getAGUUrl()
				: oauthResult.getRedirectionUrl();
		response.sendRedirect(redirectUrl);
	}

}
