package org.ftclub.cabinet.auth.domain;

/**
 * 42 API에서 제공하는 사용자의 역할을 나타내는 열거 타입입니다.
 */
public enum FtRole {
	STAFF,
	CADET,
	MEMBER,
	INACTIVE,
	PISCINER;

	/**
	 * 본 과정 이상의 사용자인지 확인합니다.
	 * <p>
	 * 본 과정이면서도 STAFF인 케이스가 있으므로 STAFF도 포함합니다.
	 *
	 * @return 본 과정 이상의 사용자인지 여부
	 */
	public boolean isInCursus() {
		return this == CADET || this == MEMBER || this == STAFF;
	}
}
