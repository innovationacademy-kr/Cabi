package org.ftclub.cabinet.auth;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.config.SiteUrlProperties;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

	@Autowired
	private final TokenProvider tokenProvider;

	@Autowired
	private final OauthService oauthService;

	@Autowired
	private final CookieManager cookieManager;

	@Autowired
	private final SiteUrlProperties siteUrlProperties;

	@Autowired
	private final GoogleApiProperties googleApiProperties;

	@Autowired
	private final JwtProperties jwtProperties;

	@GetMapping("/login")
	public void login(HttpServletResponse response) throws IOException {
		oauthService.sendToGoogleApi(response);
	}

	@GetMapping("/login/callback")
	public void loginCallback(@RequestParam String code, HttpServletResponse res) throws IOException {
		String apiToken = oauthService.getGoogleToken(code);
		JSONObject profile = oauthService.getGoogleProfile(apiToken);
		String accessToken = tokenProvider.createToken(googleApiProperties.getName(), profile);
		cookieManager.setCookie(res, jwtProperties.getAdminTokenName(), accessToken, "/");
		res.sendRedirect(siteUrlProperties.getFeHost() + "/main");
	}

	@GetMapping("/test")
	public void authtest(HttpServletResponse response) throws IOException {
		System.out.printf("REACHED!!!!REACHED!!!!REACHED!!!!REACHED!!!!REACHED!!!!\n");
	}
}
