package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.TokenProvider;
import org.ftclub.cabinet.config.ApiProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthFacadeServiceImpl implements AuthFacadeService {

	private final JwtProperties jwtProperties;
	private final TokenProvider tokenProvider;
	private final CookieManager cookieManager;
	private final AuthService authService;
	private final OauthService oauthService;

	private final UserOptionalFetcher userOptionalFetcher;


	@Override
	public void requestLoginToApi(HttpServletResponse res, ApiProperties apiProperties)
			throws IOException {
		oauthService.sendCodeRequestToApi(res, apiProperties);
	}

	@Override
	public void handleLogin(String code, HttpServletRequest req, HttpServletResponse res,
			ApiProperties apiProperties, LocalDateTime now) {
		String apiToken = oauthService.getTokenByCodeRequest(code, apiProperties);
		JsonNode profile = oauthService.getProfileJsonByToken(apiToken, apiProperties);
		Map<String, Object> claims = tokenProvider.makeClaimsByProviderProfile(
				apiProperties.getProviderName(), profile);
		authService.addUserIfNotExistsByClaims(claims);
		String accessToken = tokenProvider.createToken(claims, now);
		Cookie cookie = cookieManager.cookieOf(
				tokenProvider.getTokenNameByProvider(apiProperties.getProviderName()), accessToken);
		cookieManager.setCookieToClient(res, cookie, "/", req.getServerName());
	}

	@Override
	public void handleTestLogin(HttpServletRequest req, ApiProperties apiProperties,
			HttpServletResponse res, LocalDateTime now) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("name",
				"Test:" + userOptionalFetcher.findUsersByPartialName("Test:", Pageable.unpaged())
						.getTotalElements());
		claims.put("email", userOptionalFetcher.findUsersByPartialName("Test:", Pageable.unpaged())
				.getTotalElements() + "Test@student.42seoul.kr");
		claims.put("blackholedAt", null);
		claims.put("role", UserRole.USER);
		authService.addUserIfNotExistsByClaims(claims);
		String accessToken = tokenProvider.createToken(claims, now);
		Cookie cookie = cookieManager.cookieOf(
				tokenProvider.getTokenNameByProvider(apiProperties.getProviderName()), accessToken);
		cookieManager.setCookieToClient(res, cookie, "/", req.getServerName());
	}

	@Override
	public void masterLogin(MasterLoginDto masterLoginDto, HttpServletRequest req,
			HttpServletResponse res, LocalDateTime now) {
		if (!authService.validateMasterLogin(masterLoginDto)) {
			throw new ControllerException(ExceptionStatus.UNAUTHORIZED);
		}
		String masterToken = tokenProvider.createMasterToken(now);
		Cookie cookie = cookieManager.cookieOf(jwtProperties.getAdminTokenName(), masterToken);
		cookieManager.setCookieToClient(res, cookie, "/", req.getServerName());
	}

	@Override
	public void logout(HttpServletResponse res, ApiProperties apiProperties) {
		cookieManager.deleteCookie(res,
				tokenProvider.getTokenNameByProvider(apiProperties.getProviderName()));
	}
}
