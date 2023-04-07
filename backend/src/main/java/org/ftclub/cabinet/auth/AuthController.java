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
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	@Autowired
	private final OauthService oauthService;

	@Autowired
	private final AuthService authService;

	@Autowired
	private final SiteUrlProperties siteUrlProperties;

	@GetMapping("/login")
	public void login(HttpServletResponse response) throws IOException {
		oauthService.sendToFtApi(response);
	}

	@GetMapping("/login/callback")
	public void loginCallback(@RequestParam String code, HttpServletResponse res) throws IOException {
		String apiToken = oauthService.getFtToken(code);
		System.out.printf("apitoken = %s\n", apiToken);
		JSONObject profile = oauthService.getFtProfile(apiToken);
		System.out.printf("profile = %s\n", profile);
		String accessToken = TokenProvider.createToken("ft", profile);
		Cookie cookie = new Cookie("access_token", accessToken);
		cookie.setPath("/");
		res.addCookie(cookie);
		res.sendRedirect(siteUrlProperties.getFeHost() + "/main");
//		System.out.printf("user = %s\n", authService.getUserByName("sanan"));
		authService.saveTest();
	}

}
