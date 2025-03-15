package org.ftclub.cabinet.config.security.exception;

import java.io.IOException;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;

@RequiredArgsConstructor
public class SecurityExceptionHandlerManager {

	private final Map<ExceptionStatus, SecurityExceptionHandler> handlers;

	public void handle(HttpServletResponse res, ExceptionStatus status) throws IOException {
		SecurityExceptionHandler handler = handlers.getOrDefault(status,
				new SecurityDefaultExceptionHandler());
		handler.handle(res, status);
	}
}
