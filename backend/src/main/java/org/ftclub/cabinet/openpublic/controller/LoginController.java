package org.ftclub.cabinet.openpublic.controller;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.config.AlarmProperties;
import org.ftclub.cabinet.auth.service.AuthFacadeService;
import org.ftclub.cabinet.log.Logging;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Logging
@RequiredArgsConstructor
@RequestMapping("/demo")
@RestController
public class LoginController {

	private final AuthFacadeService authFacadeService;
	private final AlarmProperties alarmProperties;

	@GetMapping("")
	public void login(HttpServletRequest request, HttpServletResponse response) throws IOException {
		final String username = "anonymous";
		if (!alarmProperties.getIsProduction()) {
			authFacadeService.handlePublicLogin(request, response, username);
		}
	}
}
