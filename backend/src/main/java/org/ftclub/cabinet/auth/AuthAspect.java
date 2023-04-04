package org.ftclub.cabinet.auth;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.ftclub.cabinet.config.SiteUrlProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Aspect
@Component
public class AuthAspect {

	@Autowired
	SiteUrlProperties siteUrlProperties;

	@Before("@within(AuthGuard) || @annotation(AuthGuard)")
	public void AuthToken() throws IOException {
		System.out.printf("entered AuthAspect\n");
		HttpServletRequest	request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();
		HttpServletResponse	response = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getResponse();
		TokenValidator tokenValidator = new TokenValidator(); // 객체 싱글톤으로 쓰고 싶은데..
		String				token = null;

		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				System.out.printf("cookie = %s\n", cookie.getName());
				if (cookie.getName().equals("token")) {
					token = cookie.getValue();
					System.out.printf("extracted token = %s\n", token);
					break;
				}
			}
		}
		if (token == null) {
			System.out.printf("REDIRECT : send to login\n");
			response.sendRedirect("/api/admin/auth/login");
			return ;
		}
		if (!tokenValidator.isTokenValid(token, "USER")) {
			System.out.printf("REDIRECT : send to login USER\n");
			response.sendRedirect(setRedirectPathByRole("FAILURE"));
			return ;
		}
		if (!tokenValidator.isTokenValid(token, "ADMIN")) {
			System.out.printf("REDIRECT : send to login ADMIN\n");
			response.sendRedirect(setRedirectPathByRole("FAILURE"));
			return ;
		}
		System.out.printf("valid token = %s in AuthAspect\n", token);
		System.out.printf("Ended AuthGuard!\n");
	}

	public String setRedirectPathByRole(String role) {

		if (role == "ADMIN")
			return (siteUrlProperties.getFeHost() + "/api/auth/admin/login/callback");
		if (role == "USER")
			return (siteUrlProperties.getFeHost() + "/api/auth/user/login/callback");
		return (siteUrlProperties.getFeHost() + "/api/auth/login/callback");
	}
}
