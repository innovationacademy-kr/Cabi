package org.ftclub.cabinet.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.config.SiteUrlProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class AdminAuthAspect {

	@Autowired
	private final SiteUrlProperties siteUrlProperties;

	@Autowired
	private final JwtProperties jwtProperties;

	@Autowired
	private final TokenValidator tokenValidator;

	@Autowired
	private final CookieManager	cookieManager;

	@Around("@within(AdminAuthGuard) || @annotation(AdminAuthGuard)")
	public void AuthToken(ProceedingJoinPoint joinPoint) throws Throwable {
		HttpServletRequest	request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();
		HttpServletResponse	response = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getResponse();

		String adminAccessToken	= cookieManager.getCookie(request, jwtProperties.getAdminTokenName());
		if (adminAccessToken == null
		||	!tokenValidator.isAdminTokenValid(adminAccessToken)) {
//			throw new HttpServerErrorException(HttpStatus.UNAUTHORIZED, "Unauthorized");
			response.sendRedirect(getRedirectPathByRole("ADMIN"));
			return ;
		}

		System.out.printf("Ended AuthGuard!\n");
		joinPoint.proceed();
	}

	public String getRedirectPathByRole(String role) {

		if (role == "ADMIN")
			return (siteUrlProperties.getFeHost() + "/api/admin/auth/login/");
		if (role == "USER")
			return (siteUrlProperties.getFeHost() + "/api/auth/login/");
		return (siteUrlProperties.getFeHost() + "/api/auth/login/");
	}
}
