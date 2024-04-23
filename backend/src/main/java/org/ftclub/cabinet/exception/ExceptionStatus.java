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
	NOT_FOUND_ADMIN(HttpStatus.NOT_FOUND, "어드민이 존재하지 않습니다"),
	NOT_FOUND_CABINET(HttpStatus.NOT_FOUND, "사물함이 존재하지 않습니다."),
	NOT_FOUND_LENT_HISTORY(HttpStatus.NOT_FOUND, "대여한 사물함이 존재하지 않습니다."),
	NOT_FOUND_CLUB(HttpStatus.NOT_FOUND, "동아리가 존재하지 않습니다."),
	LENT_CLUB(HttpStatus.I_AM_A_TEAPOT, "동아리 전용 사물함입니다"),
	LENT_NOT_CLUB(HttpStatus.I_AM_A_TEAPOT, "동아리 전용 사물함이 아닙니다"),
	LENT_EXPIRE_IMMINENT(HttpStatus.I_AM_A_TEAPOT, "만료가 임박한 공유 사물함입니다\n해당 사물함은 대여할 수 없습니다"),
	LENT_FULL(HttpStatus.CONFLICT, "사물함에 잔여 자리가 없습니다"),
	LENT_EXPIRED(HttpStatus.FORBIDDEN, "연체된 사물함은 대여할 수 없습니다"),
	LENT_BROKEN(HttpStatus.FORBIDDEN, "고장난 사물함은 대여할 수 없습니다"),
	NO_LENT_CABINET(HttpStatus.FORBIDDEN, "대여한 사물함이 없습니다"),
	INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 에러가 발생했습니다"),
	OAUTH_BAD_GATEWAY(HttpStatus.BAD_GATEWAY, "인증 서버와 통신 중 에러가 발생했습니다"),
	SLACK_BAD_GATEWAY(HttpStatus.BAD_GATEWAY, "슬랙 서버와 통신 중 에러가 발생했습니다"),
	UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "로그인 정보가 유효하지 않습니다\n다시 로그인해주세요"),
	UNCHANGEABLE_CABINET(HttpStatus.BAD_REQUEST, "사물함의 상태를 변경할 수 없습니다."),
	LENT_ALREADY_EXISTED(HttpStatus.BAD_REQUEST, "이미 대여중인 사물함이 있습니다"),
	USER_ALREADY_EXISTED(HttpStatus.BAD_REQUEST, "이미 존재하는 유저입니다"),
	ADMIN_ALREADY_EXISTED(HttpStatus.BAD_REQUEST, "이미 존재하는 어드민입니다"),
	NOT_CLUB_USER(HttpStatus.BAD_REQUEST, "동아리 유저가 아닙니다"),
	INVALID_ARGUMENT(HttpStatus.BAD_REQUEST, "유효하지 않은 입력입니다"),
	INVALID_STATUS(HttpStatus.BAD_REQUEST, "유효하지 않은 상태변경입니다"),
	JSON_PROCESSING_EXCEPTION(HttpStatus.BAD_REQUEST, "JSON 파싱 중 에러가 발생했습니다"),
	SHARE_CODE_TRIAL_EXCEEDED(HttpStatus.BAD_REQUEST, "초대 코드 입력 오류 초과로 입장이 제한된 상태입니다."),
	INVALID_EXPIRED_AT(HttpStatus.BAD_REQUEST, "잘못된 만료일 입니다"),
	INCORRECT_ARGUMENT(HttpStatus.BAD_REQUEST, "잘못된 입력입니다"),
	ALL_BANNED_USER(HttpStatus.BAD_REQUEST, "ALL 밴 상태의 유저입니다."),
	SHARE_BANNED_USER(HttpStatus.BAD_REQUEST, "초대코드를 3회 이상 틀린 유저입니다."),
	LENT_PENDING(HttpStatus.BAD_REQUEST, "오픈 예정인 사물함입니다."),
	WRONG_SHARE_CODE(HttpStatus.BAD_REQUEST, "초대코드가 유효하지 않습니다."),
	NOT_FOUND_BAN_HISTORY(HttpStatus.NOT_FOUND, "현재 정지 상태인 유저가 아닙니다."),
	BLACKHOLED_USER(HttpStatus.BAD_REQUEST, "블랙홀 상태의 유저입니다."),
	BLACKHOLE_REFRESHING(HttpStatus.BAD_REQUEST, "블랙홀 갱신 중 입니다.\n잠시 후에 다시 시도해주세요."),
	UNAUTHORIZED_ADMIN(HttpStatus.UNAUTHORIZED, "관리자 로그인 정보가 유효하지 않습니다\n다시 로그인해주세요"),
	UNAUTHORIZED_USER(HttpStatus.UNAUTHORIZED, "사용자 로그인 정보가 유효하지 않습니다\n다시 로그인해주세요"),
	EXTERNAL_API_EXCEPTION(HttpStatus.BAD_REQUEST, "외부 API와 통신 중 에러가 발생했습니다"),
	EXISTED_CLUB_USER(HttpStatus.CONFLICT, "이미 존재하는 동아리 유저입니다"),
	CLUB_HAS_LENT_CABINET(HttpStatus.NOT_ACCEPTABLE, "대여 중인 사물함을 반납 후 삭제할 수 있습니다."),
	HANEAPI_ERROR(HttpStatus.BAD_GATEWAY, "24HANE API 통신에 에러가 있습니다."),
	EXTENSION_NOT_FOUND(HttpStatus.BAD_REQUEST, "연장권이 존재하지 않습니다."),
	EXTENSION_SOLO_IN_SHARE_NOT_ALLOWED(HttpStatus.UNAUTHORIZED, "연장권은 1명일 때 사용할 수 없습니다."),
	EXTENSION_LENT_DELAYED(HttpStatus.UNAUTHORIZED, "연장권은 연체된 사물함에 사용할 수 없습니다."),
	MAIL_BAD_GATEWAY(HttpStatus.BAD_GATEWAY, "메일 전송 중 에러가 발생했습니다"),
	SLACK_REQUEST_BAD_GATEWAY(HttpStatus.BAD_GATEWAY, "슬랙 인증 중 에러가 발생했습니다."),
	SLACK_MESSAGE_SEND_BAD_GATEWAY(HttpStatus.BAD_GATEWAY, "슬랙 메세지 전송 중 에러가 발생했습니다."),
	SLACK_ID_NOT_FOUND(HttpStatus.NOT_FOUND, "슬랙 아이디를 찾을 수 없습니다."),
	NOT_FOUND_ALARM(HttpStatus.BAD_REQUEST, "알람이 존재하지 않습니다"),
	INVALID_LENT_TYPE(HttpStatus.BAD_REQUEST, "사물함의 대여 타입이 유효하지 않습니다."),
	NOT_FOUND_BUILDING(HttpStatus.NOT_FOUND, "빌딩이 존재하지 않습니다."),
	SWAP_EXPIRE_IMMINENT(HttpStatus.I_AM_A_TEAPOT, "현재 사물함의 대여 기간의 만료가 임박해 사물함을 이동 할 수 없습니다."),
	SWAP_LIMIT_EXCEEDED(HttpStatus.I_AM_A_TEAPOT, "사물함 이사 횟수 제한을 초과했습니다.\n 일주일에 1회만 이사할 수 있습니다."),
	SWAP_RECORD_NOT_FOUND(HttpStatus.NOT_FOUND, "이사하기 기능을 사용한 기록이 없습니다."),
	SWAP_SAME_CABINET(HttpStatus.BAD_REQUEST, "같은 사물함으로 이사할 수 없습니다."),
	INVALID_CLUB(HttpStatus.BAD_REQUEST, "동아리가 맞지 않습니다."),
	NOT_CLUB_MASTER(HttpStatus.BAD_REQUEST, "동아리 장이 아닙니다."),
	INVALID_CLUB_MASTER(HttpStatus.BAD_REQUEST, "동아리에 동아리 장이 없습니다."),
	NOT_FOUND_CLUB_LENT_HISTORY(HttpStatus.NOT_FOUND, "동아리가 대여한 사물함이 없습니다."),
	INVALID_PRESENTATION_CATEGORY(HttpStatus.BAD_REQUEST, "발표회에 정의된 카테고리가 아닙니다."),
	INVALID_DATE(HttpStatus.BAD_REQUEST, "잘못된 날짜입니다."),
	PRESENTATION_ALREADY_EXISTED(HttpStatus.CONFLICT, "이미 예약된 발표 날짜입니다"),
	NOT_FOUND_FORM(HttpStatus.NOT_FOUND, "신청서가 존재하지 않습니다."),
	INVALID_FORM_ID(HttpStatus.BAD_REQUEST, "잘못된 신청번호입니다."),
	INVALID_LOCATION(HttpStatus.BAD_REQUEST, "잘못된 장소입니다."),
	ITEM_NOT_FOUND(HttpStatus.NOT_FOUND, "아이템이 존재하지 않습니다."),
	;

	final private int statusCode;
	final private String message;
	final private String error;

	ExceptionStatus(HttpStatus status, String message) {
		this.statusCode = status.value();
		this.message = message;
		this.error = status.getReasonPhrase();
	}

	public ControllerException asControllerException() {
		return new ControllerException(this);
	}

	public ServiceException asServiceException() {
		return new ServiceException(this);
	}

	public DomainException asDomainException() {
		return new DomainException(this);
	}

	public UtilException asUtilException() {
		return new UtilException(this);
	}
}
