package org.ftclub.cabinet.config.security.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.auth.domain.CustomOauth2User;
import org.ftclub.cabinet.auth.domain.OauthResult;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.ftclub.cabinet.auth.service.AuthenticationService;
import org.ftclub.cabinet.auth.service.OauthService;
import org.ftclub.cabinet.exception.CustomAccessDeniedException;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

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
			authenticationService.processAuthentication(request, response, oauthResult, provider);
			String redirectUrl = oauthResult.getRedirectionUrl();

			if (oauthResult.hasRole("AGU")) {
				redirectUrl = authPolicyService.getAGUUrl();
			}
			response.sendRedirect(redirectUrl);
		} catch (Exception e) {
			ExceptionStatus status = handleAuthenticationException(e);

			redirectWithError(response, status);
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
	private OauthResult processOAuthLogin(HttpServletRequest req, String provider,
			CustomOauth2User oauth2User) throws JsonProcessingException {
		if (provider.equals(ftProvider)) {
			JsonNode rootNode =
					objectMapper.convertValue(oauth2User.getAttributes(), JsonNode.class);

			return oauthService.handleFtLogin(rootNode);
		}
		if (isExternalProvider(provider)) {
			return oauthService.handleExternalOAuthLogin(oauth2User, req);
		}
		throw new CustomAccessDeniedException(ExceptionStatus.NOT_SUPPORT_OAUTH_TYPE);
	}

	/**
	 * 에러 핸들링
	 *
	 * @param e successHandler 처리 도중 발생할 수 있는 에러들 핸들링
	 * @return
	 */
	private ExceptionStatus handleAuthenticationException(Exception e) {

		if (e instanceof CustomAuthenticationException) {
			return ((CustomAuthenticationException) e).getStatus();
		}
		if (e instanceof CustomAccessDeniedException) {
			return ((CustomAccessDeniedException) e).getStatus();
		}
		if (e instanceof ExpiredJwtException) {
			return ExceptionStatus.EXPIRED_JWT_TOKEN;
		}
		if (e instanceof JwtException) {
			return ExceptionStatus.JWT_EXCEPTION;
		}
		if (e instanceof NullPointerException) {
			return ExceptionStatus.JSON_PROCESSING_EXCEPTION;
		}
		if (e instanceof ServiceException) {
			return ((ServiceException) e).getStatus();
		}
		if (e instanceof DomainException) {
			return ((DomainException) e).getStatus();
		}
		log.error("Authentication Failed", e);
		return ExceptionStatus.INTERNAL_SERVER_ERROR;
	}

	/**
	 * 지정한 oauth provider인지 검증합니다.
	 *
	 * @param provider
	 * @return
	 */
	private boolean isExternalProvider(String provider) {
		return provider.equals(googleProvider);
	}

	/**
	 * SuccessHandling 도중 예외 발생 시 예외 페이지로 redirect 합니다.
	 *
	 * @param response
	 * @param status
	 * @throws IOException
	 */
	private void redirectWithError(HttpServletResponse response, ExceptionStatus status)
			throws IOException {
		String errorCode = status.getError();
		String message = status.name();

		log.error("error Redirect Start");
		String uri = UriComponentsBuilder.fromHttpUrl(authPolicyService.getOauthErrorPage())
				.queryParam("code", errorCode)
				.queryParam("status", status.getStatusCode())
				.queryParam("message", message)
				.encode(StandardCharsets.UTF_8)
				.toUriString();

		response.sendRedirect(uri);
	}

}
