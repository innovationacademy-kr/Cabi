package org.ftclub.cabinet.item.domain;

import lombok.Getter;
import org.ftclub.cabinet.exception.ExceptionStatus;

@Getter
public enum Sku {

	EXTENSION_3("3일"),
	EXTENSION_15("15일"),
	EXTENSION_31("31일"),

	PENALTY_3("3일"),
	PENALTY_7("7일"),
	PENALTY_31("31일"),

	SWAP("교환권"),
	ALARM("알림권");


	private final String type;

	Sku(String type) {
		this.type = type;
	}

	public boolean isValid() {
		return this.equals(EXTENSION_3) || this.equals(EXTENSION_15) || this.equals(EXTENSION_31)
			|| this.equals(PENALTY_3) || this.equals(PENALTY_7) || this.equals(PENALTY_31)
			|| this.equals(SWAP) || this.equals(ALARM);
	}

	public Integer getDays() {
		if (this.equals(EXTENSION_3) || this.equals(PENALTY_3)) {
			return 3;
		}
		if (this.equals(EXTENSION_31) || this.equals(PENALTY_31)) {
			return 31;
		}
		if (this.equals(EXTENSION_15)) {
			return 15;
		}
		if (this.equals(PENALTY_7)) {
			return 7;
		}
		throw ExceptionStatus.NOT_FOUND_ITEM.asDomainException();
	}

}
