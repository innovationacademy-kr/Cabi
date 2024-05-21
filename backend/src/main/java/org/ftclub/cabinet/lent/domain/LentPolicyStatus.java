package org.ftclub.cabinet.lent.domain;

/**
 * 대여 상태
 */
public enum LentPolicyStatus {
	/**
	 * 빌릴 수 있음
	 */
	FINE,
	/**
	 * 만료 임박
	 */
	IMMINENT_EXPIRATION,
	/**
	 * 권한 없는 유저가 club 사물함을 대여하는 상태
	 */
	LENT_CLUB,
	/**
	 * 사물함이 가득 참
	 */
	FULL_CABINET,
	/**
	 * 사물함이 연체됨
	 */
	OVERDUE_CABINET,
	/**
	 * 사물함이 고장남
	 */
	BROKEN_CABINET,
	/**
	 * 대여 가능하도록 풀릴 사물함
	 */
	PENDING_CABINET,
	/**
	 * 내부 에러
	 */
	INTERNAL_ERROR,
	/**
	 * 대여하려는 유저가 club
	 */
	NOT_USER,
	/**
	 * 이미 대여한 기록이 있음
	 */
	ALREADY_LENT_USER,
	/**
	 * ALL 벤 기록이 있음
	 */
	ALL_BANNED_USER,
	/**
	 * shareCode를 3회 이상 틀린 유저
	 */
	SHARE_BANNED_USER,
	BLACKHOLED_USER, SWAP_EXPIREDAT_IMMINENT,
	INVALID_LENT_TYPE,
	INVALID_ARGUMENT,
	INVALID_EXPIREDAT, SWAP_SAME_CABINET, LENT_NOT_CLUB,

	SWAP_LIMIT_EXCEEDED

}