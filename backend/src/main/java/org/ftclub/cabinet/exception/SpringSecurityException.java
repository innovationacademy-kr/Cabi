package org.ftclub.cabinet.exception;

import lombok.Getter;

@Getter
public class SpringSecurityException extends RuntimeException {

	final ExceptionStatus status;

	public SpringSecurityException(ExceptionStatus status) {
		this.status = status;
	}

	@Override
	public String getMessage() {
		return status.getMessage();
	}
}
