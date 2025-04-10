package org.ftclub.cabinet.security.exception;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import java.io.IOException;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.log.Logging;
import org.springframework.security.access.AccessDeniedException;

/**
 * Spring security 에서 발생하는 예외들을 핸들링합니다.
 */
@Slf4j
@RequiredArgsConstructor
@Logging
public class SecurityExceptionHandlerManager {

	private final SecurityDefaultExceptionHandler defaultHandler;
	private final SecurityRedirectExceptionHandler redirectHandler;

	public void handle(HttpServletResponse res, Exception e, boolean isRedirect) {
		ExceptionStatus status = extractStatus(e);
		SecurityExceptionHandler handler = isRedirect ? redirectHandler : defaultHandler;

		try {
			log.info("Error = {}", status.getError());
			handler.handle(res, status);
		} catch (IOException ioException) {
			// handler 에서 response 생성 도중 예외 발생
			log.error("Failed to write response: ", ioException);
			res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

	private ExceptionStatus extractStatus(Exception e) {
		if (e instanceof SpringSecurityException) {
			return ((SpringSecurityException) e).getStatus();
		}
		if (e instanceof ServiceException) {
			return ((ServiceException) e).getStatus();
		}
		if (e instanceof DomainException) {
			return ((DomainException) e).getStatus();
		}
		if (e instanceof ExpiredJwtException) {
			return ExceptionStatus.EXPIRED_JWT_TOKEN;
		}
		if (e instanceof JwtException) {
			return ExceptionStatus.JWT_EXCEPTION;
		}
		if (e instanceof NullPointerException) {
			return ExceptionStatus.JSON_PROCESSING_EXCEPTION;
		}
		if (e instanceof AccessDeniedException) {
			return ExceptionStatus.FORBIDDEN_USER;
		}
		if (log.isDebugEnabled()) {
			log.debug("Exception Trace Stack : ", e);
		}
		return ExceptionStatus.INTERNAL_SERVER_ERROR;
	}
}
