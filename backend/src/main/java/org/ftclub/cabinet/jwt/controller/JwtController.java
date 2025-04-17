package org.ftclub.cabinet.jwt.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/jwt")
public class JwtController {

	private final JwtService tokenService;

	@PostMapping("/reissue")
	public TokenDto reissue(
			HttpServletRequest request,
			HttpServletResponse response) {
		return tokenService.reissueToken(request, response);
	}
}
