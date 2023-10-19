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
    NOT_FOUND_ADMIN_USER(HttpStatus.NOT_FOUND, "어드민이 존재하지 않습니다"),
    NOT_FOUND_CABINET(HttpStatus.NOT_FOUND, "사물함이 존재하지 않습니다."),
    LENT_CLUB(HttpStatus.I_AM_A_TEAPOT, "동아리 전용 사물함입니다"),
    LENT_EXPIRE_IMMINENT(HttpStatus.I_AM_A_TEAPOT, "만료가 임박한 공유 사물함입니다\n해당 사물함은 대여할 수 없습니다"),
    LENT_FULL(HttpStatus.CONFLICT, "사물함에 잔여 자리가 없습니다"),
    LENT_EXPIRED(HttpStatus.FORBIDDEN, "연체된 사물함은 대여할 수 없습니다"),
    LENT_BROKEN(HttpStatus.FORBIDDEN, "고장난 사물함은 대여할 수 없습니다"),
    NO_LENT_CABINET(HttpStatus.FORBIDDEN, "대여한 사물함이 없습니다"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 에러가 발생했습니다"),
    OAUTH_BAD_GATEWAY(HttpStatus.BAD_GATEWAY, "인증 서버와 통신 중 에러가 발생했습니다"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "로그인 정보가 유효하지 않습니다\n다시 로그인해주세요"),
    UNCHANGEABLE_CABINET(HttpStatus.BAD_REQUEST, "사물함의 상태를 변경할 수 없습니다."),
    LENT_ALREADY_EXISTED(HttpStatus.BAD_REQUEST, "이미 대여중인 사물함이 있습니다"),
    INVALID_ARGUMENT(HttpStatus.BAD_REQUEST, "유효하지 않은 입력입니다"),
    INVALID_STATUS(HttpStatus.BAD_REQUEST, "유효하지 않은 상태변경입니다"),
    INVALID_EXPIRED_AT(HttpStatus.BAD_REQUEST, "잘못된 만료일 입니다"),
    INCORRECT_ARGUMENT(HttpStatus.BAD_REQUEST, "잘못된 입력입니다"),
    ALL_BANNED_USER(HttpStatus.BAD_REQUEST, "ALL 밴 상태의 유저입니다."),
    SHARE_BANNED_USER(HttpStatus.BAD_REQUEST, "SHARE 밴 상태의 유저입니다."),
    NOT_FOUND_BAN_HISTORY(HttpStatus.NOT_FOUND, "현재 정지 상태인 유저가 아닙니다."),
    BLACKHOLED_USER(HttpStatus.BAD_REQUEST, "블랙홀 상태의 유저입니다."),
    BLACKHOLE_REFRESHING(HttpStatus.BAD_REQUEST, "블랙홀 갱신 중 입니다.\n잠시 후에 다시 시도해주세요."),
    UNAUTHORIZED_ADMIN(HttpStatus.UNAUTHORIZED, "관리자 로그인 정보가 유효하지 않습니다\n다시 로그인해주세요"),
    UNAUTHORIZED_USER(HttpStatus.UNAUTHORIZED, "사용자 로그인 정보가 유효하지 않습니다\n다시 로그인해주세요"),
    EXTERNAL_API_EXCEPTION(HttpStatus.BAD_REQUEST, "외부 API와 통신 중 에러가 발생했습니다"),
    EXISTED_CLUB_USER(HttpStatus.CONFLICT, "이미 존재하는 동아리 유저입니다"),
    CLUB_HAS_LENT_CABINET(HttpStatus.NOT_ACCEPTABLE, "대여 중인 사물함을 반납 후 삭제할 수 있습니다."),
    SLACK_BAD_GATEWAY(HttpStatus.BAD_GATEWAY, "슬랙과 통신 중 에러가 발생했습니다"),
    ;

    final private int statusCode;
    final private String message;
    final private String error;

    ExceptionStatus(HttpStatus status, String message) {
        this.statusCode = status.value();
        this.message = message;
        this.error = status.getReasonPhrase();
    }
}
