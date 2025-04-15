package org.ftclub.cabinet.security.handler;

import io.jsonwebtoken.Claims;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

@RequiredArgsConstructor
public class CustomAuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {

	private final OAuth2AuthorizationRequestResolver defaultResolver;
	private final JwtService jwtService;

	@Override
	public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {

		OAuth2AuthorizationRequest req = defaultResolver.resolve(request);
		return customize(req, request);
	}

	@Override
	public OAuth2AuthorizationRequest resolve(HttpServletRequest request,
			String clientRegistrationId) {

		OAuth2AuthorizationRequest req = defaultResolver.resolve(request, clientRegistrationId);
		return customize(req, request);
	}

	private OAuth2AuthorizationRequest customize(OAuth2AuthorizationRequest oauth2Request,
			HttpServletRequest servletRequest) {
		if (oauth2Request == null) {
			return null;
		}

		String existingState = oauth2Request.getState();
		String context = servletRequest.getParameter("context");
		Claims claims = jwtService.validateAndParseToken(existingState);

		if ("admin".equals(context)) {
			claims.put("context", context);
		}

		String token = jwtService.generateToken(claims, (long) 30 * 60 * 1000);
		OAuth2AuthorizationRequest.Builder builder =
				OAuth2AuthorizationRequest.from(oauth2Request).state(token);

		String loginParam = servletRequest.getParameter("login");
		if (loginParam != null) {
			Map<String, Object> params = new HashMap<>(oauth2Request.getAdditionalParameters());
			params.put("prompt", loginParam);
			builder.additionalParameters(params);
		}

		return builder.build();
	}


}
