package org.ftclub.cabinet.user.domain;


public enum UserRole {

	CLUB, CLUB_ADMIN;

	public boolean isValid() {
		return this.equals(CLUB) || this.equals(CLUB_ADMIN);
	}
}