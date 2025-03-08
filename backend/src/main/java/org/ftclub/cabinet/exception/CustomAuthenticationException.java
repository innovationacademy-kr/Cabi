package org.ftclub.cabinet.exception;

import lombok.Getter;
import org.springframework.security.core.AuthenticationException;

@Getter
public class CustomAuthenticationException extends AuthenticationException {

	private final ExceptionStatus status;

	public CustomAuthenticationException(ExceptionStatus status) {
		super(status.getMessage());
		this.status = status;
	}

	@Override
	public String getMessage() {
		return status.getMessage();
	}

}
