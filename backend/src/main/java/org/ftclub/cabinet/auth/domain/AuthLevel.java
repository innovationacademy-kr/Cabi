package org.ftclub.cabinet.auth.domain;

/**
 * 해당 어노테이션의 Level을 이용해서, 필요한 인증의 유무를 명시합니다.
 * <br>
 * USER : 일반 유저
 * <br>
 * ADMIN : 일반 관리자
 * <br>
 * MASTER : 최고 관리자
 */
public enum AuthLevel {
	USER_ONLY,
	ADMIN_ONLY,
	USER_OR_ADMIN,
	MASTER_ONLY,
}
