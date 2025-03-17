package org.ftclub.cabinet.config.security.exception;

import lombok.Getter;
import org.ftclub.cabinet.exception.ExceptionStatus;

@Getter
public class SpringSecurityException extends RuntimeException {

	private final ExceptionStatus status;

	public SpringSecurityException(ExceptionStatus status) {
		this.status = status;
	}

	@Override
	public String getMessage() {
		return status.getMessage();
	}

}
