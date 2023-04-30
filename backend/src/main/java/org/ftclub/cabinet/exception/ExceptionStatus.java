package org.ftclub.cabinet.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * {@link ServiceException}을 위한 enum 클래스 생성할 exception에 대한 정보를 담고있다.
 */
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
@RequiredArgsConstructor
@Getter
public enum ExceptionStatus {
    NOT_FOUND_USER(HttpStatus.NOT_FOUND, "유저가 존재하지 않습니다"),
    NOT_FOUND_CABINET(HttpStatus.NOT_FOUND, "사물함이 존재하지 않습니다."),
    LENT_CLUB(HttpStatus.I_AM_A_TEAPOT, "동아리 전용 사물함입니다"),
    LENT_LONG_TERM(HttpStatus.I_AM_A_TEAPOT, "만료가 임박한 공유 사물함입니다\\n해당 사물함은 대여할 수 없습니다"),
    LENT_FULL(HttpStatus.CONFLICT, "사물함에 잔여 자리가 없습니다"),
    LENT_EXPIRED(HttpStatus.FORBIDDEN, "연체된 사물함은 대여할 수 없습니다"),
    LENT_BROKEN(HttpStatus.FORBIDDEN, "고장난 사물함은 대여할 수 없습니다"),
    LENT_BANNED(HttpStatus.FORBIDDEN, "비활성화된 사물함입니다"),
    NO_LENT_CABINET(HttpStatus.FORBIDDEN, "대여한 사물함이 없습니다"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 에러가 발생했습니다");

    ExceptionStatus(HttpStatus status, String message) {
        this.statusCode = status.value();
        this.message = message;
        this.error = status.getReasonPhrase();
    }

    final private int statusCode;
    final private String message;
    final private String error;
}
