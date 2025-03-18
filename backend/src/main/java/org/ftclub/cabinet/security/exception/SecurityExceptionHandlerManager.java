package org.ftclub.cabinet.security.exception;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import java.io.IOException;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;

/**
 * Spring security 에서 발생하는 예외들을 핸들링합니다.
 */
@RequiredArgsConstructor
public class SecurityExceptionHandlerManager {

	private final SecurityDefaultExceptionHandler defaultHandler;
	private final SecurityRedirectExceptionHandler redirectHandler;

	public void handle(HttpServletResponse res, Exception e, boolean isRedirect)
			throws IOException {
		ExceptionStatus status = extractStatus(e);
		SecurityExceptionHandler handler = isRedirect ? redirectHandler : defaultHandler;

		handler.handle(res, status);
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
		return ExceptionStatus.INTERNAL_SERVER_ERROR;
	}
}
