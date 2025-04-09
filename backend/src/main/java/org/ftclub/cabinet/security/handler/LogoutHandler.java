package org.ftclub.cabinet.security.handler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.admin.auth.service.AdminAuthService;
import org.ftclub.cabinet.auth.service.AuthFacadeService;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.ftclub.cabinet.security.exception.SecurityExceptionHandlerManager;
import org.ftclub.cabinet.security.exception.SpringSecurityException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LogoutHandler implements LogoutSuccessHandler {

	private final SecurityExceptionHandlerManager securityExceptionHandlerManager;
	private final AdminAuthService adminAuthService;
	private final AuthFacadeService authFacadeService;
	private final JwtService jwtService;

	@Override
	public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) {
		try {
			if (isAdminUser(request)) {
				log.info("adminLogoutStart!");
				adminAuthService.adminLogout(request, response);
				response.setStatus(HttpServletResponse.SC_OK);
				return;
			}
			log.info("user Logout Start!! ");
			authFacadeService.userLogout(request, response);
			response.setStatus(HttpServletResponse.SC_OK);
		} catch (SpringSecurityException e) {
			securityExceptionHandlerManager.handle(response, e, false);
		}
	}

	private boolean isAdminUser(HttpServletRequest req) {
		String accessToken = jwtService.extractToken(req);
		UserInfoDto userInfoDto = jwtService.validateTokenAndGetUserInfo(accessToken);

		return userInfoDto.hasRole("ADMIN") || userInfoDto.hasRole("MASTER");
	}
}
