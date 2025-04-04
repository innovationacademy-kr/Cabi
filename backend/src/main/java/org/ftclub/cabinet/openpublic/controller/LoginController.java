package org.ftclub.cabinet.openpublic.controller;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.service.AuthFacadeService;
import org.ftclub.cabinet.log.Logging;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Logging
@RequiredArgsConstructor
@Profile("dev")
@RequestMapping("/demo")
@RestController
public class LoginController {

	private final AuthFacadeService authFacadeService;
	@Value("${cabinet.server.be-host}")
	private String beHost;

	@GetMapping("")
	public void login(HttpServletRequest request, HttpServletResponse response) throws IOException {
		final String username = "anonymous";
		authFacadeService.handlePublicLogin(request, response, username);
	}
}
