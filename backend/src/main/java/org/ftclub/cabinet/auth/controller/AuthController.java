package org.ftclub.cabinet.auth.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;
import java.util.concurrent.ExecutionException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.service.AuthFacadeService;
import org.ftclub.cabinet.config.security.AccessTokenDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v4/auth")
@RequiredArgsConstructor
@Log4j2
public class AuthController {

	private final AuthFacadeService authFacadeService;

	/**
	 * 사용자 로그인 페이지로 리다이렉트합니다.
	 *
	 * @param response 요청 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	@GetMapping("/login")
	public void login(HttpServletRequest request, HttpServletResponse response) throws IOException {
		authFacadeService.requestUserLogin(request, response);
	}

	/**
	 * 사용자 로그인 콜백을 처리합니다.
	 *
	 * @param code 로그인 성공으로 받은 authorization 코드
	 * @param res  요청 시의 서블릿 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	@GetMapping("/login/callback")
	public void loginCallback(
			@RequestParam String code,
			HttpServletRequest req,
			HttpServletResponse res) throws IOException, ExecutionException, InterruptedException {
		authFacadeService.handleUserLogin(req, res, code);
	}

	/**
	 * AGU 유저의 임시 로그인
	 */
	@PostMapping("/login/AGU")
	public void requestAGULogin(@RequestParam(name = "name") String name)
			throws JsonProcessingException {
		authFacadeService.requestTemporaryLogin(name);
	}


	@GetMapping("/login/AGU")
	public AccessTokenDto loginAguLogin(
			@RequestParam(name = "code") String code,
			@RequestParam(name = "name") String name) {
		return authFacadeService.verifyTemporaryCode(name, code);
	}

	/**
	 * 로그아웃시, HTTP Response 의 set-cookie Header 를 지워줍니다. cookie에 담긴 JWT 토큰을 제거합니다.
	 *
	 * @param res 요청 시의 서블릿 {@link HttpServletResponse}
	 */
	@GetMapping("/logout")
	public void logout(HttpServletResponse res) {
		authFacadeService.userLogout(res);
	}
}
