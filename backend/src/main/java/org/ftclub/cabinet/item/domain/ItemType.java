package org.ftclub.cabinet.item.domain;

import lombok.Getter;

@Getter
public enum ItemType {

	EXTENSION("연장권"),
	PENALTY("패널티완화권"),
	EXCHANGE("교환권"),
	ALARM("알림권");

	private final String type;

	ItemType(String type) {
		this.type = type;
	}

	public String getType() {
		return this.type;
	}

	public boolean isValid() {
		return this.equals(EXTENSION) || this.equals(PENALTY) || this.equals(EXCHANGE)
				|| this.equals(ALARM);
	}
}
