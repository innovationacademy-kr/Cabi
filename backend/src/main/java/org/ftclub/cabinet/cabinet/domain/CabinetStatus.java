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
	 * PENDING : 다음 날 풀릴 사물함 상태
	 * <br>
	 * IS_SESSION : 10분 동안 대여 대기 상태
	 */
	BROKEN, AVAILABLE, FULL, LIMITED_AVAILABLE, OVERDUE, PENDING, IN_SESSION;

	public boolean isValid() {
		return this.equals(BROKEN) || this.equals(AVAILABLE) || this.equals(FULL) ||
				this.equals(LIMITED_AVAILABLE) || this.equals(OVERDUE) || this.equals(PENDING)
				|| this.equals(IN_SESSION);
	}
}
