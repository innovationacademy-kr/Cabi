package org.ftclub.cabinet.security.handler;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.security.exception.SecurityExceptionHandlerManager;
import org.ftclub.cabinet.security.exception.SpringSecurityException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/**
 * 인증되지 않은 사용자가 보호 리소스 호출 시 예외 발생.
 * <p>
 * 인증정보 자체가 없거나, 정보가 유효하지 않으므로 contextHolder 를 비웁니다. Unauthorized 상태로 응답을 반환합니다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CustomUnauthorizedAuthenticationEntryPoint implements AuthenticationEntryPoint {

	private final SecurityExceptionHandlerManager securityExceptionHandlerManager;

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException {
		log.error("Authentication Fail: {}, Request Uri : {}",
				authException.getMessage(), request.getRequestURI());

		SecurityContextHolder.clearContext();

		boolean isRedirect = false;
		securityExceptionHandlerManager.handle(response,
				new SpringSecurityException(ExceptionStatus.ANONYMOUS_NOT_ALLOWED), isRedirect);
	}

}
