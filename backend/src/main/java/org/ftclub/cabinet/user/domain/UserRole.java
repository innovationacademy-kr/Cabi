package org.ftclub.cabinet.user.domain;


public enum UserRole {
    USER, CLUB;

    public boolean isValid() {
        return this.equals(USER) || this.equals(CLUB);
    }
}
