package org.ftclub.cabinet.cabinet.domain;


public enum CabinetStatus {
	BROKEN, AVAILABLE, FULL, LIMITED_AVAILABLE, OVERDUE;

	public boolean isValid() {
		return this.equals(BROKEN) || this.equals(AVAILABLE) || this.equals(FULL) ||
				this.equals(LIMITED_AVAILABLE) || this.equals(OVERDUE);
	}
}
