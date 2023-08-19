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
	 * OVERDUE :연체됨
	 */
	BROKEN, AVAILABLE, FULL, OVERDUE;

	public boolean isValid() {
		return this.equals(BROKEN) || this.equals(AVAILABLE) || this.equals(FULL) || this.equals(
				OVERDUE);
	}
}
