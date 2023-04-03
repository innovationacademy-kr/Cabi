package org.ftclub.cabinet.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * {@link ServiceException}을 위한 enum 클래스
 * 생성할 exception에 대한 정보를 담고있다.
 */
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
@RequiredArgsConstructor
@Getter
public enum ExceptionStatus {
    NOT_FOUND_USER(HttpStatus.NOT_FOUND, "유저가 존재하지 않습니다");

    ExceptionStatus(HttpStatus status, String message) {
        this.statusCode = status.value();
        this.message = message;
        this.error = status.getReasonPhrase();
    }
    final private int statusCode;
    final private String message;
    final private String error;
}