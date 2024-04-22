package org.ftclub.cabinet.item.domain;

public enum AlarmType {
	SHARE, PRIVATE, ALL;


	public boolean isValid() {
		return this.equals(SHARE) || this.equals(PRIVATE) || this.equals(ALL);
	}
}
