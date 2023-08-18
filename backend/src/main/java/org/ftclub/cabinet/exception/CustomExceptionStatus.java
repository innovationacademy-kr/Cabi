package org.ftclub.cabinet.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * {@link CustomServiceException}을 위한 exception 클래스. 생성할 exception에 대한 정보를 담고있다.
 */
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
@RequiredArgsConstructor
@Getter
public class CustomExceptionStatus {
	private final int statusCode;
	private final String message;
	private final String error;

	public CustomExceptionStatus(HttpStatus status, String message) {
		this.statusCode = status.value();
		this.message = message;
		this.error = status.getReasonPhrase();
	}

	public CustomExceptionStatus(ExceptionStatus status, String message) {
		this.statusCode = status.getStatusCode();
		this.message = status.getMessage() + "\n" + message;
		this.error = status.getError();
	}
}
