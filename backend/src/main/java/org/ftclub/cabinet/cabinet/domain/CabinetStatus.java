package org.ftclub.cabinet.cabinet.domain;


/**
 * 사물함의 사용 관련 상태입니다.
 */
public enum CabinetStatus {
	/**
	 * BROKEN : 고장
	 * <br>
	 * AVAILABLE : 사용 가능
	 * <br>
	 * FULL : 꽉 참
	 * <br>
	 * LIMITED_AVAILABLE : 만료기한이 설정되었으나 사용 가능
	 * <br>
	 * OVERDUE : 연체됨
	 * <br>
	 * IN_SESSION : 공유사물함 10분 대여 대기 중
	 * <br>
	 * PENDING : 다음날 풀릴 사물함 상태
	 */
	BROKEN, AVAILABLE, FULL, OVERDUE, IN_SESSION, PENDING;

	public boolean isValid() {
		return this.equals(BROKEN) || this.equals(AVAILABLE) || this.equals(FULL) ||
				this.equals(LIMITED_AVAILABLE) || this.equals(OVERDUE);
	}
}
