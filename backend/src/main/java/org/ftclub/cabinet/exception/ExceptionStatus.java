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
	NOT_FOUND_ITEM(HttpStatus.NOT_FOUND, "아이템이 존재하지 않습니다"),
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
	COIN_COLLECTION_ALREADY_EXIST(HttpStatus.BAD_REQUEST, "오늘은 이미 동전줍기를 수행했습니다."),
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
	EXTENSION_LENT_DELAYED(HttpStatus.FORBIDDEN, "연장권은 연체된 사물함에 사용할 수 없습니다."),
	EXTENSION_SOLO_IN_SHARE_NOT_ALLOWED(HttpStatus.UNAUTHORIZED, "연장권은 1명일 때 사용할 수 없습니다."),
	MAIL_BAD_GATEWAY(HttpStatus.BAD_GATEWAY, "메일 전송 중 에러가 발생했습니다"),
	SLACK_REQUEST_BAD_GATEWAY(HttpStatus.BAD_GATEWAY, "슬랙 인증 중 에러가 발생했습니다."),
	SLACK_MESSAGE_SEND_BAD_GATEWAY(HttpStatus.BAD_GATEWAY, "슬랙 메세지 전송 중 에러가 발생했습니다."),
	SLACK_ID_NOT_FOUND(HttpStatus.NOT_FOUND, "슬랙 아이디를 찾을 수 없습니다."),
	NOT_FOUND_ALARM(HttpStatus.BAD_REQUEST, "알람이 존재하지 않습니다"),
	INVALID_LENT_TYPE(HttpStatus.BAD_REQUEST, "사물함의 대여 타입이 유효하지 않습니다."),
	NOT_FOUND_BUILDING(HttpStatus.NOT_FOUND, "빌딩이 존재하지 않습니다."),
	SWAP_EXPIRE_IMMINENT(HttpStatus.I_AM_A_TEAPOT, "현재 사물함의 대여 기간의 만료가 임박해 사물함을 이동 할 수 없습니다."),
	SWAP_RECORD_NOT_FOUND(HttpStatus.NOT_FOUND, "이사하기 기능을 사용한 기록이 없습니다."),
	SWAP_SAME_CABINET(HttpStatus.BAD_REQUEST, "같은 사물함으로 이사할 수 없습니다."),
	SWAP_LIMIT_EXCEEDED(HttpStatus.BAD_REQUEST, "이사하기 기능을 이미 사용했습니다."),
	INVALID_CLUB(HttpStatus.BAD_REQUEST, "동아리가 맞지 않습니다."),
	NOT_CLUB_MASTER(HttpStatus.BAD_REQUEST, "동아리 장이 아닙니다."),
	INVALID_CLUB_MASTER(HttpStatus.BAD_REQUEST, "동아리에 동아리 장이 없습니다."),
	NOT_FOUND_CLUB_LENT_HISTORY(HttpStatus.NOT_FOUND, "동아리가 대여한 사물함이 없습니다."),
	INVALID_PRESENTATION_CATEGORY(HttpStatus.BAD_REQUEST, "발표회에 정의된 카테고리가 아닙니다."),
	INVALID_PRESENTATION_DATE(HttpStatus.BAD_REQUEST, "가능한 발표 날짜가 아닙니다"),
	INVALID_DATE(HttpStatus.BAD_REQUEST, "잘못된 날짜입니다."),
	PRESENTATION_ALREADY_EXISTED(HttpStatus.CONFLICT, "이미 예약된 발표 날짜입니다"),
	NOT_FOUND_FORM(HttpStatus.NOT_FOUND, "신청서가 존재하지 않습니다."),
	INVALID_FORM_ID(HttpStatus.BAD_REQUEST, "잘못된 신청번호입니다."),
	INVALID_LOCATION(HttpStatus.BAD_REQUEST, "잘못된 장소입니다."),
	INVALID_ITEM_USE_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 아이템 사용 요청입니다."),
	ITEM_NOT_ON_SALE(HttpStatus.BAD_REQUEST, "구매할 수 없는 아이템입니다."),
	NOT_ENOUGH_COIN(HttpStatus.BAD_REQUEST, "보유한 코인이 아이템 가격보다 적습니다."),
	INVALID_JWT_TOKEN(HttpStatus.BAD_REQUEST, "토큰이 없거나, 유효하지 않은 JWT 토큰입니다."),
	NOT_FOUND_SECTION(HttpStatus.BAD_REQUEST, "사물함 구역 정보를 찾을 수 없습니다."),
	ITEM_NOT_OWNED(HttpStatus.BAD_REQUEST, "해당 아이템을 보유하고 있지 않습니다"),
	ITEM_USE_DUPLICATED(HttpStatus.FORBIDDEN, "아이템이 중복 사용되었습니다."),
	INVALID_AMOUNT(HttpStatus.BAD_REQUEST, "코인 지급양은 비어있을 수 없습니다."),
	FORBIDDEN_USER(HttpStatus.FORBIDDEN, "권한이 부족한 유저입니다"),
	NO_ACTIVE_LENT_FOUND(HttpStatus.BAD_REQUEST, "대여 기록이 존재하지 않습니다"),

	// Security 토큰 관련 -> 존재하지 않거나, malFormed, signature, expired
	INVALID_TYPE_JWT_TOKEN(HttpStatus.UNAUTHORIZED, "올바르지 않은 토큰입니다."),
	EXPIRED_JWT_TOKEN(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
	INVALID_AUTHORIZATION(HttpStatus.UNAUTHORIZED, "Oauth로부터 정보를 받아오지 못했습니다."),
	DUPLICATED_OAUTH_MAIL(HttpStatus.BAD_REQUEST, "이미 등록된 oauthMail 입니다."),
	NOT_FT_LINK_STATUS(HttpStatus.FORBIDDEN, "42 계정과 연동 상태가 아닙니다."),
	NOT_SUPPORT_OAUTH_TYPE(HttpStatus.FORBIDDEN, "지원하지 않는 OAuth 타입입니다."),
	OAUTH_EMAIL_ALREADY_LINKED(HttpStatus.CONFLICT, "이미 다른 oauth 계정이 연동되어 있습니다."),
	AUTHENTICATION_FAILED(HttpStatus.UNAUTHORIZED, "인증에 실패했습니다."),
	ACCESS_DENIED(HttpStatus.FORBIDDEN, "권한이 부족합니다"),

	// JWT 관련 에러,
	JWT_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "JWT 토큰이 존재하지 않습니다."),
	JWT_EXPIRED(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
	JWT_EXCEPTION(HttpStatus.UNAUTHORIZED, "JWT 에러가 발생하였습니다."),
	JWT_INVALID(HttpStatus.UNAUTHORIZED, "토큰의 서명이 올바르지 않거나, 변조되었습니다."),
	JWT_UNSUPPORTED(HttpStatus.UNAUTHORIZED, "지원하지 않는 토큰 형식입니다."),
	JWT_NOT_EXPIRED(HttpStatus.BAD_REQUEST, "만료되지 않은 토큰의 재발급 요청입니다"),
	JWT_ALREADY_USED(HttpStatus.BAD_REQUEST, "이미 사용된 토큰입니다."),
	NOT_FOUND_VERIFICATION_CODE(HttpStatus.BAD_REQUEST, "기한이 만료되었거나, 올바르지 않은 코드입니다."),
	NOT_FOUND_VERIFICATION_LINK(HttpStatus.BAD_REQUEST, "인증 링크가 일치하지 않습니다"),
	NOT_FOUND_OAUTH_CONNECTION(HttpStatus.NOT_FOUND, "Oauth 연동 기록이 존재하지 않습니다"),
	INVALID_OAUTH_CONNECTION(HttpStatus.BAD_REQUEST, "Oauth 연동 기록이 일치하지 않습니다"),
	INVALID_CSRF(HttpStatus.FORBIDDEN, "잘못된 형식의 CSRF 토큰입니다"),
	MISSING_CSRF(HttpStatus.FORBIDDEN, "CSRF 토큰이 존재하지 않습니다"),
	CODE_ALREADY_SENT(HttpStatus.TOO_MANY_REQUESTS, "링크가 이미 발송되었습니다. 3분 후 재발송 가능합니다."),

	// Presentation 관련
	CANNOT_CREATE_SLOT_IN_PAST(HttpStatus.BAD_REQUEST, "과거 시간으로는 발표 슬롯을 생성할 수 없습니다."),
	SLOT_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "해당 시간에는 이미 발표 슬롯이 존재합니다."),
	NOT_FOUND_PRESENTATION(HttpStatus.NOT_FOUND, "발표가 존재하지 않습니다"),
	SLOT_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 발표 슬롯이 존재하지 않습니다."),
	CANNOT_DELETE_SLOT_WITH_PRESENTATION(HttpStatus.BAD_REQUEST, "발표가 있는 슬롯은 삭제할 수 없습니다."),
	FILE_SIZE_EXCEEDED(HttpStatus.BAD_REQUEST, "파일 크기가 너무 큽니다."),
	INVALID_FILE_EXTENSION(HttpStatus.BAD_REQUEST, "잘못된 파일 확장자입니다."),
	S3_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "S3 업로드 중 에러가 발생했습니다."),
	S3_GET_URL_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "S3 URL 생성 중 에러가 발생했습니다."),
	S3_DELETE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "S3 삭제 중 에러가 발생했습니다."),
	PRESENTATION_SLOT_ALREADY_ASSIGNED(HttpStatus.BAD_REQUEST, "이미 발표 슬롯에 발표가 할당되어 있습니다."),
	PRESENTATION_SLOT_ALREADY_CANCELED(HttpStatus.BAD_REQUEST, "이미 발표 슬롯이 취소되었습니다."),
	CANNOT_SEARCH_PAST_SLOT(HttpStatus.BAD_REQUEST, "과거 슬롯은 조회할 수 없습니다."),
	NOT_ALLOWED_PERIOD(HttpStatus.BAD_REQUEST, "허용된 기간 외의 슬롯은 존재할 수 없습니다."),
	PRESENTATION_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 발표가 존재하지 않습니다."),
	PRESENTATION_ALREADY_CANCELED(HttpStatus.BAD_REQUEST, "이미 취소된 발표입니다."),
	PRESENTATION_SLOT_ALREADY_HAS_PRESENTATION(HttpStatus.BAD_REQUEST, "이미 발표가 등록된 슬롯입니다."),
	ANONYMOUS_NOT_ALLOWED(HttpStatus.UNAUTHORIZED, "익명 사용자는 사용할 수 없습니다."),

	// Presentation Comment 관련
	PRESENTATION_COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "댓글이 존재하지 않습니다"),
	PRESENTATION_COMMENT_TOO_LONG(HttpStatus.BAD_REQUEST, "댓글은 500자 이내로 작성해야 합니다"),
	PRESENTATION_COMMENT_EMPTY(HttpStatus.BAD_REQUEST, "댓글은 비어있을 수 없습니다"),
	PRESENTATION_COMMENT_NOT_AUTHORIZED(HttpStatus.FORBIDDEN, "댓글 작성자가 아닙니다"),
	PRESENTATION_COMMENT_INVALID_ASSOCIATION(HttpStatus.BAD_REQUEST, "수정하려는 댓글이 해당 발표에 속하지 않습니다."),
	PRESENTATION_COMMENT_BANNED(HttpStatus.BAD_REQUEST, "밴 당한 댓글은 삭제할 수 없습니다."),

	// Presentation user 권한 관련
	NOT_LOGGED_IN(HttpStatus.UNAUTHORIZED, "로그인이 필요한 서비스입니다."),
	PRESENTATION_ACCESS_DENIED(HttpStatus.FORBIDDEN, "권한이 부족합니다."),
	CANCELED_PRESENTATION(HttpStatus.FORBIDDEN, "취소된 발표입니다.\n해당 글은 작성자만 확인할 수 있습니다."),
	NOT_PRESENTATION_CREATOR(HttpStatus.FORBIDDEN, "작성자만 수정할 수 있습니다."),
	CANCELED_PRESENTATION_EDIT_DENIED(HttpStatus.BAD_REQUEST, "취소된 발표는 수정할 수 없습니다."),
	PRESENTATION_UPDATE_DURATION_DENIED(HttpStatus.BAD_REQUEST, "발표 시간은 수정할 수 없습니다."),
	PRESENTATION_UPDATE_CATEGORY_DENIED(HttpStatus.BAD_REQUEST, "발표 카테고리는 수정할 수 없습니다."),
	PRESENTATION_UPDATE_TITLE_DENIED(HttpStatus.BAD_REQUEST, "발표 제목은 수정할 수 없습니다."),
	PRESENTATION_UPDATE_VIDEO_LINK_DENIED(HttpStatus.BAD_REQUEST, "발표 영상 링크는 수정할 수 없습니다."),
	PRESENTATION_UPDATE_RECORDING_ALLOWED_DENIED(HttpStatus.BAD_REQUEST,
			"발표 녹화 허용 여부는 수정할 수 없습니다."),

	// Presentation Like 관련
	PRESENTATION_LIKE_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "이미 좋아요 표시한 게시글입니다."),
	PRESENTATION_LIKE_NOT_FOUND(HttpStatus.BAD_REQUEST, "이미 삭제된 좋아요 입니다."),


	// REMOVE (just for conflict)
	REMOVE(HttpStatus.BAD_REQUEST, "삭제할 내용(오로지 마지막 ; 작성 용)");

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
