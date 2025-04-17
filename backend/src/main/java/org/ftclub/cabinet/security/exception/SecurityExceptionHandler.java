package org.ftclub.cabinet.security.exception;

import java.io.IOException;
import javax.servlet.http.HttpServletResponse;
import org.ftclub.cabinet.exception.ExceptionStatus;

public interface SecurityExceptionHandler {

	void handle(HttpServletResponse res, ExceptionStatus status)
			throws IOException;

}
