package org.ftclub.cabinet.item.domain;

public enum Sku {

	EXTENSION_3("3일"),
	EXTENSION_15("15일"),
	EXTENSION_31("31일"),

	PENALTY_3("3일"),
	PENALTY_7("7일"),
	PENALTY_31("31일"),

	EXCHANGE("교환권"),
	ALARM("알림권")


	private final String type;

	Sku(String type) {
		this.type = type;
	}

	public String getType() {
		return this.type;
	}

	public boolean isValid() {
		return this.equals(EXTENSION_3) || this.equals(EXTENSION_15) || this.equals(EXTENSION_31)
				|| this.equals(PENALTY_3) || this.equals(PENALTY_7) || this.equals(PENALTY_31)
				|| this.equals(EXCHANGE) || this.equals(ALARM);
	}
}
