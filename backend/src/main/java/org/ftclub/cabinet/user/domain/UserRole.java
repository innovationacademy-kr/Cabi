package org.ftclub.cabinet.user.domain;


public enum UserRole {
	USER, CLUB, CLUB_ADMIN;

	public boolean isValid() {
		return this.equals(USER) || this.equals(CLUB);
	}
}