package org.ftclub.cabinet.exception;

import lombok.Getter;

@Getter
public class DomainException extends RuntimeException implements FtClubCabinetException {

	final ExceptionStatus status;

	/**
	 * @param status exception에 대한 정보에 대한 enum
	 */
	public DomainException(ExceptionStatus status) {
		this.status = status;
	}

	@Override
	public String getMessage() {
		return status.getMessage();
	}
}
