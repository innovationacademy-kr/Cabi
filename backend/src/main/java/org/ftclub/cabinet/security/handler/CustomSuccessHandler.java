package org.ftclub.cabinet.security.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.service.AuthFacadeService;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.oauth.domain.CustomOauth2User;
import org.ftclub.cabinet.oauth.domain.OauthResult;
import org.ftclub.cabinet.oauth.service.OauthFacadeService;
import org.ftclub.cabinet.security.exception.SecurityExceptionHandlerManager;
import org.ftclub.cabinet.security.exception.SpringSecurityException;
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
@Slf4j
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {


	private static final List<String> availableProvider =
			List.of("ft", "google", "kakao", "naver", "github");
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
		CustomOauth2User fromLoadUser = (CustomOauth2User) authentication.getPrincipal();
		String provider = fromLoadUser.getProvider();

		try {
			OauthResult oauthResult = processOAuthLogin(request, provider, fromLoadUser);
			authFacadeService.processAuthentication(request, response, oauthResult, provider);
			String redirectUrl = oauthResult.getRedirectionUrl();

			if (oauthResult.hasRole("AGU")) {
				redirectUrl = authPolicyService.getAGUUrl();
			}
			response.sendRedirect(redirectUrl);
		} catch (Exception e) {
			SecurityContextHolder.clearContext();
			securityExceptionHandlerManager.handle(response, e, true);
		}
	}

	/**
	 * oauth2 login 위치에 따라 OauthResult 생성, redirect 경로 지정
	 *
	 * @param req
	 * @param provider
	 * @param oauth2User
	 * @return
	 */
	private OauthResult processOAuthLogin(HttpServletRequest req,
			String provider, CustomOauth2User oauth2User) {

		if (provider.equals(mainProvider)) {
			JsonNode rootNode =
					objectMapper.convertValue(oauth2User.getAttributes(), JsonNode.class);

			return oauthFacadeService.handleFtLogin(rootNode);
		}
		if (availableProvider.contains(provider)) {
			return oauthFacadeService.handleExternalOAuthLogin(oauth2User, req);
		}
		throw new SpringSecurityException(ExceptionStatus.NOT_SUPPORT_OAUTH_TYPE);
	}

}
