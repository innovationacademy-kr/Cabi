package org.ftclub.cabinet.user.domain;

/**
 * 어드민의 권한을 나타내는 열거형 클래스입니다.
 */
public enum AdminRole {
	/**
	 * NONE: 승인 대기 - 무권한
	 * <p>
	 * ADMIN: 일반 관리자
	 * <p>
	 * MASTER: 최고 관리자
	 */
	NONE, ADMIN, MASTER;

}
