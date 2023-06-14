package org.ftclub.cabinet.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.util.Map;
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
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthFacadeServiceImpl implements AuthFacadeService {

	private final JwtProperties jwtProperties;
	private final TokenProvider tokenProvider;
	private final CookieManager cookieManager;
	private final AuthService authService;
	private final OauthService oauthService;

	@Override
	public void requestLoginToApi(HttpServletResponse res, ApiProperties apiProperties)
			throws IOException {
		oauthService.sendToApi(res, apiProperties);
	}

	@Override
	public void handleLogin(String code, HttpServletRequest req, HttpServletResponse res,
			ApiProperties apiProperties) {
		String apiToken = oauthService.getTokenByCode(code, apiProperties);
		JsonNode profile = oauthService.getProfileByToken(apiToken, apiProperties);
		Map<String, Object> claims = tokenProvider.makeClaimsByProviderProfile(
				apiProperties.getProviderName(), profile);
		authService.addUserIfNotExistsByClaims(claims);
		String accessToken = tokenProvider.createToken(claims, DateUtil.getNow());
		cookieManager.setCookie(res,
				tokenProvider.getTokenNameByProvider(apiProperties.getProviderName()),
				accessToken,
				"/",
				req.getServerName());
	}

	@Override
	public void masterLogin(MasterLoginDto masterLoginDto, HttpServletRequest req,
			HttpServletResponse res) {
		if (!authService.validateMasterLogin(masterLoginDto)) {
			throw new ControllerException(ExceptionStatus.UNAUTHORIZED);
		}
		String masterToken = tokenProvider.createMasterToken(DateUtil.getNow());
		cookieManager.setCookie(res, jwtProperties.getAdminTokenName(), masterToken, "/",
				req.getServerName());
	}

	@Override
	public void logout(HttpServletResponse res, ApiProperties apiProperties) {
		cookieManager.deleteCookie(res,
				tokenProvider.getTokenNameByProvider(apiProperties.getProviderName()));
	}
}
