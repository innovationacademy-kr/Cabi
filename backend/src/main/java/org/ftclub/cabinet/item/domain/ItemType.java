package org.ftclub.cabinet.item.domain;

import lombok.Getter;

@Getter
public enum ItemType {

	EXTENSION("연장권",
			"현재 대여 중인 사물함의 반납 기한을 3일, 15일 또는 30일 연장할 수 있습니다."),
	PENALTY("패널티 감면권",
			"사물함 이용 중 발생한 페널티 일수를 감소시켜 사물함 사용 제한 기간을 줄일 수 있습니다."),
	SWAP("이사권"
			, "현재 대여 중인 사물함의 반납 기한을 유지하면서 다른 사물함으로 이동할 수 있습니다."),
	ALARM("알림 등록권",
			"원하는 사물함 구역의 개인 사물함 자리가 빈 경우, 다음 날 오픈 5분 전 알림을 받을 수 있습니다."),

	COIN_COLLECT("동전 줍기",
			"누군가가 매일 흘리는 동전을 주워보세요\uD83D\uDCB0\n동전은 하루에 한 번씩 획득할 수 있습니다"),
	COIN_REWARD("동전 줍기 20일 보상",
			"20일 동안 매일 동전을 주웠다면, 보너스 동전을 받습니다\uD83D\uDCB0"),
	COIN_FULL_TIME("42 출석 보상",
			"42 서울에 열심히 출석했다면, 보상을 받을 수 있습니다\uD83D\uDCB0"),
	;

	private final String name;
	private final String description;

	ItemType(String name, String description) {
		this.name = name;
		this.description = description;
	}

	public boolean isValid() {
		return this.equals(EXTENSION) || this.equals(PENALTY) || this.equals(SWAP)
				|| this.equals(ALARM);
	}
}
