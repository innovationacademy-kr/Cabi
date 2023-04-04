package org.ftclub.cabinet.auth;

import lombok.RequiredArgsConstructor;
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
	private final OauthService oauthService;

	@Autowired
	private final SiteUrlProperties siteUrlProperties;
	@GetMapping("/login")
	public void login(HttpServletResponse response) throws IOException {
		oauthService.sendToGoogleApi(response);
	}

	@GetMapping("/login/callback")
	public void loginCallback(@RequestParam String code, HttpServletResponse res) throws IOException {
		String apiToken = oauthService.getGoogleToken(code);
		JSONObject profile = oauthService.getGoogleProfile(apiToken);
		String accessToken = TokenProvider.createToken("google", profile);
		Cookie cookie = new Cookie("access_token", accessToken);
		cookie.setPath("/");
		res.addCookie(cookie);
		res.sendRedirect(siteUrlProperties.getFeHost() + "/main");
	}

}
