package org.ftclub.cabinet.cqrs.respository;

import lombok.Getter;

@Getter
public enum CqrsProperties {
	CABINET_PER_SECTION(":cabinetPerSection"),
	CABINET_STATUS(":cabinetStatus"),
	CABINET_LENT_HISTORIES(":cabinetLentHistories"),
	CABINET_VISIBLE_NUM(":cabinetVisibleNum"),
	CABINET_INFO(":cabinetInfo"),

	USER_BAN(":userBan"),
	USER_CLUBS(":userClubs"),
	USER_NAME(":userName"),
	USER_LENT_HISTORIES(":userLentHistories"),
	USER_INFO(":userInfo"),

	LENT_COUNT(":lentCount"),
	LENT_INFO(":lentInfo"),
	BUILDINGS(":buildings"),
	PENDING_CABINET(":pendingCabinet"),

	CLUBS(":clubs"),
	CLUB_CABINETS(":clubCabinets"),

	STATISTICS(":statistics");

	private final String value;

	CqrsProperties(String value) {
		this.value = value;
	}

}

