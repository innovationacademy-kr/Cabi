package org.ftclub.cabinet.exception;

import lombok.Getter;
import org.springframework.security.core.AuthenticationException;

@Getter
public class JwtAuthenticationException extends AuthenticationException {

	private final ExceptionStatus status;

	public JwtAuthenticationException(ExceptionStatus status) {
		super(status.getMessage());
		this.status = status;
	}

	@Override
	public String getMessage() {
		return status.getMessage();
	}

	public int getStatus() {
		return status.getStatusCode();
	}

	public String getError() {
		return status.getError();
	}
}
