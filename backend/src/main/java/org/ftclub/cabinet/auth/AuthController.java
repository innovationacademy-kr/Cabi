package org.ftclub.cabinet.auth;

import java.io.IOException;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.config.SiteUrlProperties;
import org.json.JSONObject;
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

	@GetMapping("/login")
	public void login(HttpServletResponse response) throws IOException {
		oauthService.sendToFtApi(response);
	}

	@GetMapping("/login/callback")
	public void loginCallback(@RequestParam String code, HttpServletRequest req,
			HttpServletResponse res) throws IOException {
		String apiToken = oauthService.getFtToken(code);
		JSONObject profile = oauthService.getFtProfile(apiToken);
		String accessToken = tokenProvider.createToken(ftApiProperties.getName(), profile,
				new Date());
		String serverName = req.getServerName();
		cookieManager.setCookie(res, jwtProperties.getMainTokenName(), accessToken, "/",
				serverName);
		res.sendRedirect(siteUrlProperties.getFeHost() + "/main");
	}

}
