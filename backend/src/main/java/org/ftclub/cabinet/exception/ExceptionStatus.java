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
    OAUTH_BAD_GATEWAY(HttpStatus.BAD_GATEWAY, "인증 서버와의 연결이 원활하지 않습니다\\n잠시 후 다시 시도해주세요"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "로그인 정보가 유효하지 않습니다\\n다시 로그인해주세요"),
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
