package hello.hellospring.author;

import hello.hellospring.oauthtest.JwtTokenProvider;
import hello.hellospring.oauthtest.LoginResponse;
import hello.hellospring.oauthtest.OauthService;
import io.jsonwebtoken.Jwts;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
// api/admin/auth, /api/auth
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

	private final OauthService oauthService;

	@GetMapping("/login")
	public void login() {
		oauthService.sendToApi("google");
	}

	@GetMapping("/login/callback")
	public void loginCallback(@RequestParam String code) {
		LoginResponse res;
		AdminProfileDto profile = oauthService.getProfile("google", code);
		// 쿠키에 값 삽입 + 리다이렉트할 주소 알려주는것 == 컨트롤러에서 할 일
		res.cookie(tokenProvider("google", profile));
		return res.redirect(fe_host + "/home");
	}
}
