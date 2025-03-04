package org.ftclub.cabinet.jwt.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.jwt.service.JwtTokenProvider;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v5/jwt")
public class JwtController {

	private final JwtTokenProvider tokenProvider;

	@PostMapping("/reissue")
	public TokenDto reissue(
			HttpServletRequest request,
			HttpServletResponse response,
			@CookieValue(name = JwtTokenConstants.REFRESH_TOKEN) String refreshToken) {
		return tokenProvider.reissueToken(request, response, refreshToken);
	}
}
