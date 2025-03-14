package org.ftclub.cabinet.admin.auth.controller;

import java.io.IOException;
import java.util.concurrent.ExecutionException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.auth.service.AdminAuthService;
import org.ftclub.cabinet.auth.service.AuthFacadeService;
import org.ftclub.cabinet.dto.AccessTokenDto;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.log.Logging;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 관리자 인증을 수행하는 컨트롤러 클래스입니다.
 */
@RestController
@RequestMapping("/v4/admin/auth")
@RequiredArgsConstructor
@Logging
public class AdminAuthController {

	private final AuthFacadeService authFacadeService;
	private final AdminAuthService adminAuthService;

	/**
	 * 관리자 로그인 페이지로 리다이렉트 합니다.
	 *
	 * @param res 요청 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	@GetMapping("/login")
	public void login(HttpServletRequest req,
			HttpServletResponse res) throws IOException {
		adminAuthService.requestAdminLogin(req, res);
	}

	/**
	 * 최고 관리자 로그인을 수행합니다.
	 *
	 * @param req            요청 시의 서블렛 {@link HttpServletRequest}
	 * @param res            응답 시의 서블렛 {@link HttpServletResponse}
	 * @param masterLoginDto 최고 관리자 로그인 정보
	 */
	@PostMapping("/login")
	public AccessTokenDto masterLogin(HttpServletRequest req,
			HttpServletResponse res,
			@Valid @RequestBody MasterLoginDto masterLoginDto) {

		return adminAuthService.masterLogin(masterLoginDto, req, res);
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
	public void logout(HttpServletRequest req, HttpServletResponse res,
			@AuthenticationPrincipal UserInfoDto user,
			@CookieValue(name = JwtTokenConstants.REFRESH_TOKEN) String refreshToken)
			throws IOException {
		adminAuthService.adminLogout(req, res, user.getUserId(), refreshToken);
	}
}
