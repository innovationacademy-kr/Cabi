package org.ftclub.cabinet.user.domain;

public enum BanType {
	ALL, SHARE, PRIVATE, NONE;

	public boolean isValid() {
		return this.equals(ALL) || this.equals(SHARE) || this.equals(PRIVATE) || this.equals(NONE);
	}
}