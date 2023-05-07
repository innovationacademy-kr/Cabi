package org.ftclub.cabinet.cabinet.domain;


public enum LentType {
	PRIVATE, SHARE, CLUB;

	public boolean isValid() {
		return this.equals(PRIVATE) || this.equals(SHARE) || this.equals(CLUB);
	}
}
