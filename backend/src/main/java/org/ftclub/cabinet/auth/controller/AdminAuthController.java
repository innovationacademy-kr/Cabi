package org.ftclub.cabinet.auth.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.service.AuthFacadeService;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.concurrent.ExecutionException;

/**
 * 관리자 인증을 수행하는 컨트롤러 클래스입니다.
 */
@RestController
@RequestMapping("/v4/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

	private final AuthFacadeService authFacadeService;

	/**
	 * 관리자 로그인 페이지로 리다이렉트 합니다.
	 *
	 * @param res 요청 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	@GetMapping("/login")
	public void login(HttpServletResponse res) throws IOException {
		authFacadeService.requestAdminLogin(res);
	}

	/**
	 * 최고 관리자 로그인을 수행합니다.
	 *
	 * @param req            요청 시의 서블렛 {@link HttpServletRequest}
	 * @param res            응답 시의 서블렛 {@link HttpServletResponse}
	 * @param masterLoginDto 최고 관리자 로그인 정보
	 */
	@PostMapping("/login")
	public void masterLogin(HttpServletRequest req,
	                        HttpServletResponse res,
	                        @RequestBody MasterLoginDto masterLoginDto) {
		authFacadeService.masterLogin(masterLoginDto, req, res, LocalDateTime.now());
	}

	/**
	 * OAuth 로그인 콜백을 수행합니다.
	 *
	 * @param code 구글 API로부터 쿼리로 받은 인증 코드
	 * @param req  요청 시의 서블렛 {@link HttpServletRequest}
	 * @param res  요청 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */

	@GetMapping("/login/callback")
	public void loginCallback(@RequestParam String code, HttpServletRequest req,
	                          HttpServletResponse res) throws IOException, ExecutionException, InterruptedException {
		authFacadeService.handleAdminLogin(req, res, code);
	}

	/**
	 * 관리자 로그아웃을 수행합니다.
	 *
	 * @param res 요청 시의 서블릿 {@link HttpServletResponse}
	 */
	@GetMapping("/logout")
	public void logout(HttpServletResponse res) {
		authFacadeService.adminLogout(res);
	}
}
