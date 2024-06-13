package org.ftclub.cabinet.item.domain;

public enum CoinHistoryType {
	ALL,
	EARN,
	USE;

	public boolean isValid() {
		return this.equals(ALL) || this.equals(EARN) || this.equals(USE);
	}
}
