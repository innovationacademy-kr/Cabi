package org.ftclub.cabinet.exception;

import lombok.Getter;
import org.springframework.security.access.AccessDeniedException;

@Getter
public class CustomAccessDeniedException extends AccessDeniedException {

	private final ExceptionStatus status;

	public CustomAccessDeniedException(ExceptionStatus status) {
		super(status.getMessage());
		this.status = status;
	}

	@Override
	public String getMessage() {
		return status.getMessage();
	}
}
