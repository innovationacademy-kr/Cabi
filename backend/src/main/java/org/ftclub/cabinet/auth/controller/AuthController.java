package org.ftclub.cabinet.auth.controller;

import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.TokenProvider;
import org.ftclub.cabinet.auth.service.OauthService;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.config.SiteUrlProperties;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final TokenProvider tokenProvider;
	private final OauthService oauthService;
	private final CookieManager cookieManager;
	private final FtApiProperties ftApiProperties;
	private final SiteUrlProperties siteUrlProperties;
	private final JwtProperties jwtProperties;

	/**
	 * 42 API 로그인 페이지로 리다이렉트합니다.
	 *
	 * @param response 요청 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	@GetMapping("/login")
	public void login(HttpServletResponse response) throws IOException {
		oauthService.sendToApi(response, ftApiProperties);
	}

	/**
	 * 42 API 로그인 성공 시에 콜백을 처리합니다.
	 * <br>
	 * 42 API로부터 받은 인증 코드를 이용하여 42 API에게 인증 토큰을 요청하고,
	 * <br>
	 * 인증 토큰을 이용하여 42 API에게 프로필 정보를 요청합니다.
	 * <br>
	 * 프로필 정보를 이용하여 JWT 토큰을 생성하고, JWT 토큰을 쿠키에 저장합니다.
	 * <br>
	 * 완료되면, 프론트엔드의 메인 화면으로 리다이렉트합니다.
	 *
	 * @param code 42 API로부터 쿼리로 받은 인증 코드
	 * @param req  요청 시의 서블렛 {@link HttpServletRequest}
	 * @param res  요청 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	@GetMapping("/login/callback")
	public void loginCallback(@RequestParam String code, HttpServletRequest req,
			HttpServletResponse res) throws IOException {
		String apiToken = oauthService.getTokenByCode(code, ftApiProperties);
		JsonNode profile = oauthService.getProfileByToken(apiToken, ftApiProperties);
		String accessToken = tokenProvider.createToken(ftApiProperties.getProviderName(), profile,
				DateUtil.getNow());
		cookieManager.setCookie(res, jwtProperties.getMainTokenName(), accessToken, "/",
				req.getServerName());
		res.sendRedirect(siteUrlProperties.getFeHost() + "/main");
	}

	//todo  - logout
}
