package org.ftclub.cabinet.auth.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.service.AuthFacadeService;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 관리자 인증을 수행하는 컨트롤러 클래스입니다.
 * <p>
 * ToDo: 특정 API를 위한 properties를 이용하는 것이 아닌, admin, user 프로퍼티로 관리하기
 */
@RestController
@RequestMapping("/v4/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

	private final DomainProperties DomainProperties;
	private final GoogleApiProperties googleApiProperties;
	private final AuthFacadeService authFacadeService;

	/**
	 * 구글 로그인 페이지로 리다이렉트합니다.
	 *
	 * @param res 요청 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	@GetMapping("/login")
	public void login(HttpServletResponse res) throws IOException {
		authFacadeService.requestLoginToApi(res, googleApiProperties);
	}

	/**
	 * 최고 관리자 로그인을 수행합니다.
	 * <p>
	 * ToDo: 정적 값으로 인증하는 것이 아닌, DB에 저장된 값으로 인증하기
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
		authFacadeService.handleLogin(code, req, res, googleApiProperties, LocalDateTime.now());
		res.sendRedirect(DomainProperties.getFeHost() + "/admin/home");
	}

	/**
	 * 로그아웃시, HTTP Response 의 set-cookie Header 를 지워줍니다. cookie에 담긴 JWT 토큰을 제거합니다.
	 *
	 * @param res 요청 시의 서블릿 {@link HttpServletResponse}
	 */
	@GetMapping("/logout")
	public void logout(HttpServletResponse res) {
		authFacadeService.logout(res, googleApiProperties);
	}
}
