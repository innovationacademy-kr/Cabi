package org.ftclub.cabinet.item.domain;

import lombok.Getter;

@Getter
public enum Sku {

	EXTENSION_3("3일"),
	EXTENSION_15("15일"),
	EXTENSION_31("31일"),

	PENALTY_3("3일"),
	PENALTY_7("7일"),
	PENALTY_31("31일"),

	SWAP("이사권"),
	ALARM("알림 등록권"),

	COIN_COLLECT("동전 줍기"),
	COIN_REWARD("동전 줍기 20일 보상"),
	COIN_FULL_TIME("42 출석 보상"),
	;


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
				|| this.equals(SWAP) || this.equals(ALARM) || this.equals(COIN_COLLECT)
				|| this.equals(COIN_REWARD) || this.equals(COIN_FULL_TIME);
	}
}
