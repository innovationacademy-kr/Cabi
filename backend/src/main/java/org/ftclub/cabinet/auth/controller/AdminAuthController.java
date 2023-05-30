package org.ftclub.cabinet.auth.controller;

import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.auth.domain.TokenProvider;
import org.ftclub.cabinet.auth.service.OauthService;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.config.SiteUrlProperties;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 관리자 인증을 수행하는 컨트롤러 클래스입니다.
 */
@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

	private final TokenProvider tokenProvider;
	private final OauthService oauthService;
	private final CookieManager cookieManager;
	private final SiteUrlProperties siteUrlProperties;
	private final GoogleApiProperties googleApiProperties;
	private final JwtProperties jwtProperties;

	/**
	 * 구글 로그인 페이지로 리다이렉트합니다.
	 *
	 * @param response 요청 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	@GetMapping("/login")
	public void login(HttpServletResponse response) throws IOException {
		oauthService.sendToApi(response, googleApiProperties);
	}

	/**
	 * 구글 로그인 성공 시에 콜백을 처리합니다.
	 * <br>
	 * 구글 API로부터 받은 인증 코드를 이용하여 구글 API에게 인증 토큰을 요청하고,
	 * <br>
	 * 인증 토큰을 이용하여 구글 API에게 프로필 정보를 요청합니다.
	 * <br>
	 * 프로필 정보를 이용하여 JWT 토큰을 생성하고, JWT 토큰을 쿠키에 저장합니다.
	 * <br>
	 * 완료되면, 프론트엔드의 메인 화면으로 리다이렉트합니다.
	 *
	 * @param code 구글 API로부터 쿼리로 받은 인증 코드
	 * @param req  요청 시의 서블렛 {@link HttpServletRequest}
	 * @param res  요청 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	@GetMapping("/login/callback")
	public void loginCallback(@RequestParam String code, HttpServletRequest req,
			HttpServletResponse res) throws IOException {
		String apiToken = oauthService.getTokenByCode(code, googleApiProperties);
		JsonNode profile = oauthService.getProfileByToken(apiToken, googleApiProperties);
		String accessToken = tokenProvider.createToken(
				googleApiProperties.getProviderName(),
				profile,
				DateUtil.getNow());
		cookieManager.setCookie(res, jwtProperties.getAdminTokenName(), accessToken, "/",
				req.getServerName());
		res.sendRedirect(siteUrlProperties.getFeHost() + "/main");
	}

}
