package org.ftclub.cabinet.exception;

public class ControllerException extends RuntimeException {

	final ExceptionStatus status;

	/**
	 * @param status exception에 대한 정보에 대한 enum
	 */
	public ControllerException(ExceptionStatus status) {
		this.status = status;
	}
}
