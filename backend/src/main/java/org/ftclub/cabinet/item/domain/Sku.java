package org.ftclub.cabinet.item.domain;

import lombok.Getter;
import org.ftclub.cabinet.exception.ExceptionStatus;

@Getter
public enum Sku {

	EXTENSION_PREV("출석 연장권 보상"),
	EXTENSION_3("3일"),
	EXTENSION_15("15일"),
	EXTENSION_31("31일"),

	PENALTY_3("3일"),
	PENALTY_7("7일"),
	PENALTY_31("31일"),

	SWAP("이사권"),
	ALARM("알림 등록권"),

	COIN_COLLECT("동전 줍기"),
	COIN_FULL_TIME("42 출석 보상"),
	COIN_REWARD_200("동전 줍기 20일 보상"),
	COIN_REWARD_500("동전 줍기 20일 보상"),
	COIN_REWARD_1000("동전 줍기 20일 보상"),
	COIN_REWARD_2000("동전 줍기 20일 보상"),

	ADMIN_REWARD_100("관리자 보상"),
	ADMIN_REWARD_200("관리자 보상"),
	ADMIN_REWARD_500("관리자 보상"),
	ADMIN_REWARD_1000("관리자 보상"),
	ADMIN_REWARD_2000("관리자 보상"),
	;

	private final String details;

	Sku(String details) {
		this.details = details;
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
