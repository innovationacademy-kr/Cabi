package org.ftclub.cabinet.config.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.ftclub.cabinet.auth.service.AuthenticationService;
import org.ftclub.cabinet.exception.CustomAccessDeniedException;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
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

		try {
			if (provider.equals(ftProvider)) {
				OauthResult user = oauthService.handleFtLogin(rootNode);
				authenticationService.processAuthentication(request, response, user, provider);

			} else if (isExternalProvider(provider)) {
				OauthResult result =
						oauthService.handleExternalOAuthLogin(fromLoadUser, request);
				authenticationService.processAuthentication(request, response, result, provider);
				redirectUrl = result.getRedirectionUrl();
			} else {
				throw new CustomAccessDeniedException(ExceptionStatus.NOT_SUPPORT_OAUTH_TYPE);
			}
			response.sendRedirect(redirectUrl);
		} catch (CustomAuthenticationException e) {
			redirectWithError(response, e.getStatus());
		} catch (CustomAccessDeniedException e) {
			redirectWithError(response, e.getStatus());
		} catch (ExpiredJwtException e) {
			redirectWithError(response, ExceptionStatus.EXPIRED_JWT_TOKEN);
		} catch (JwtException e) {
			redirectWithError(response, ExceptionStatus.JWT_INVALID);
		}
//		} catch (Exception e) {
//			redirectWithError(response, ExceptionStatus.INTERNAL_SERVER_ERROR);
//		}
	}

	private boolean isExternalProvider(String provider) {
		return provider.equals(googleProvider);
	}

	private void redirectWithError(HttpServletResponse response, ExceptionStatus exceptionStatus)
			throws IOException {
		String errorCode = exceptionStatus.getError();
		String message = exceptionStatus.name();

		response.sendRedirect(authPolicyService.getOauthErrorPage() +
				"?code=" + errorCode +
				"&status=" + exceptionStatus.getStatusCode() +
				"&message=" + message
		);
	}

}
