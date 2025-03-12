package org.ftclub.cabinet.auth.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.service.AuthenticationService;
import org.ftclub.cabinet.dto.OauthUnlinkRequestDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.dto.UserOauthMailDto;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v5/auth")
@RequiredArgsConstructor
public class AguAuthController {

	private final AuthenticationService authenticationService;

	/**
	 * 계정 연동 해제
	 *
	 * @param userInfoDto
	 */
	@DeleteMapping("/link")
	public void unLinkOauthMail(@AuthenticationPrincipal UserInfoDto userInfoDto,
			@RequestBody OauthUnlinkRequestDto dto) {
		authenticationService.deleteOauthMail(userInfoDto.getUserId(), dto.getOauthMail(),
				dto.getProvider());
	}

	/**
	 * AGU 유저의 임시 로그인 메일 발송
	 */
	@PostMapping("/agu")
	public UserOauthMailDto requestAGULogin(@RequestParam(name = "name") String name)
			throws JsonProcessingException {
		return authenticationService.requestTemporaryLogin(name);
	}

	@GetMapping("/agu")
	public void loginAguLogin(HttpServletRequest req,
			HttpServletResponse res,
			@RequestParam(name = "code") String code,
			@RequestParam(name = "name") String name) throws IOException {
		authenticationService.verifyTemporaryCode(req, res, name, code);
	}

	/**
	 * 로그아웃시, HTTP Response 의 set-cookie Header 를 지워줍니다. cookie에 담긴 JWT 토큰을 제거합니다.
	 *
	 * @param res 요청 시의 서블릿 {@link HttpServletResponse}
	 */
	@GetMapping("/logout")
	public void logout(
			@AuthenticationPrincipal UserInfoDto userInfoDto,
			@CookieValue(name = JwtTokenConstants.REFRESH_TOKEN) String refreshToken,
			HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		authenticationService.userLogout(request, response, userInfoDto.getUserId(), refreshToken);
	}
}
