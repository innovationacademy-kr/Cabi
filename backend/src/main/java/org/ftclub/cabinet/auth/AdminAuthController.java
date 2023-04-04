package org.ftclub.cabinet.auth;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.SiteUrlProperties;
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

	private final OauthService oauthService;
	private final SiteUrlProperties siteUrlProperties;

	@GetMapping("/login")
	public void login() {
		oauthService.sendToApi("google");
	}

	@GetMapping("/login/callback")
	public void loginCallback(@RequestParam String code, HttpServletResponse res) throws IOException {
		AdminProfileDto profile = oauthService.getProfile("google", code);
		Cookie cookie = new Cookie(
				"admin_access_token",
				TokenProvider.createToken("google", profile)
			);

		// 쿠키에 값 삽입 + 리다이렉트할 주소 알려주는것 == 컨트롤러에서 할 일
		res.addCookie(cookie);
		res.sendRedirect(siteUrlProperties.getFeHost() + "/home");
	}

//	@GetMapping("/api/admin/auth/login/callback2")
//	public ResponseEntity<Void> adminLogin(HttpServletResponse response) throws IOException {
//		JwtProvider jwtProvider = new JwtProvider();
//
//		String tokenPutted = jwtProvider.creatToken("hello!", 1000 * 60 * 60);
//		Cookie cookie = new Cookie("token", tokenPutted);
//		cookie.setPath("/");
//		response.addCookie(cookie);
//		System.out.printf("added token!\n");
//		return ResponseEntity.status(HttpStatus.FOUND)
//				.header(HttpHeaders.LOCATION, siteUrlProperties.getFeHost() + "/hello")
//				.build();
//	}

//	@GetMapping("/api/admin/auth/login/callback")
//	public String login(@RequestParam String code) {
//		System.out.printf("code = %s", code);
//		return "redirect:/";
//	}
}
