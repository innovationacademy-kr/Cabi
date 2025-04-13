package org.ftclub.cabinet.auth.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.service.AuthFacadeService;
import org.ftclub.cabinet.auth.service.CookieService;
import org.ftclub.cabinet.auth.service.OauthLinkFacadeService;
import org.ftclub.cabinet.dto.AguMailResponse;
import org.ftclub.cabinet.dto.OauthUnlinkRequestDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.log.Logging;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Logging
@RestController
@RequestMapping("/v5/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthFacadeService authFacadeService;
	private final OauthLinkFacadeService oauthLinkFacadeService;
	private final CookieService cookieService;

	/**
	 * AGU 유저의 임시 로그인 메일 발송
	 */
	@PostMapping("/agu")
	public AguMailResponse requestAGULogin(@RequestParam(name = "name") String name)
			throws JsonProcessingException {
		return authFacadeService.requestTemporaryLogin(name);
	}

	/**
	 * csrf 토큰 발급
	 *
	 * @return
	 */
	@GetMapping("/csrf")
	public ResponseEntity<Void> getCsrfToken() {

		return ResponseEntity.noContent().build();
	}

	/**
	 * agu link 와 비교 후 토큰 발급
	 *
	 * @param req
	 * @param res
	 * @param code
	 * @param name
	 * @throws IOException
	 */
	@GetMapping("/agu")
	public void verifyAguCode(HttpServletRequest req,
			HttpServletResponse res,
			@RequestParam(name = "code") String code,
			@RequestParam(name = "name") String name) throws IOException {
		authFacadeService.verifyTemporaryCode(req, res, name, code);
	}

	/**
	 * Agu 유저의 사물함 반납 취소
	 *
	 * @param req
	 */
	@PostMapping("/agu/cancel")
	public void aguCancel(HttpServletRequest req, HttpServletResponse res) {
		authFacadeService.deleteAguCookie(req, res);
	}

	/**
	 * 로그아웃시, HTTP Response 의 set-cookie Header 를 지워줍니다. cookie에 담긴 JWT 토큰을 제거합니다.
	 *
	 * @param res 요청 시의 서블릿 {@link HttpServletResponse}
	 */
	@PostMapping("/logout")
	public void logout(HttpServletRequest request, HttpServletResponse response) {
		authFacadeService.userLogout(request, response);
	}

	@DeleteMapping("/link")
	public void unLinkOauthMail(@AuthenticationPrincipal UserInfoDto userInfoDto,
			@RequestBody OauthUnlinkRequestDto dto) {
		oauthLinkFacadeService.deleteOauthMail(userInfoDto.getUserId(), dto.getOauthMail(),
				dto.getProvider());
	}
}
