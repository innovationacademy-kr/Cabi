package org.ftclub.cabinet.security.handler;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.auth.service.AdminAuthService;
import org.ftclub.cabinet.auth.service.AuthFacadeService;
import org.ftclub.cabinet.security.SecurityPathPolicyService;
import org.ftclub.cabinet.security.exception.SecurityExceptionHandlerManager;
import org.ftclub.cabinet.security.exception.SpringSecurityException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LogoutHandler implements LogoutSuccessHandler {

	private final SecurityExceptionHandlerManager securityExceptionHandlerManager;
	private final SecurityPathPolicyService securityPathPolicy;
	private final AdminAuthService adminAuthService;
	private final AuthFacadeService authFacadeService;

	@Override
	public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		try {
			if (securityPathPolicy.isAdminContext()) {
				adminAuthService.adminLogout(request, response);
				response.setStatus(HttpServletResponse.SC_OK);
				return;
			}
			authFacadeService.userLogout(request, response);
			response.setStatus(HttpServletResponse.SC_OK);
		} catch (SpringSecurityException e) {
			securityExceptionHandlerManager.handle(response, e, false);
		}
	}
}
