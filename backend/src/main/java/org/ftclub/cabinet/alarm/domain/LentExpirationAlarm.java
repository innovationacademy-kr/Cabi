package org.ftclub.cabinet.alarm.domain;

import lombok.AllArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;

import java.time.LocalDateTime;

/**
 * 대여 만료 알람
 */
@AllArgsConstructor
public class LentExpirationAlarm implements Alarm {
	//TODO : CabinetPlace는 Dto로 전환이 필요함(엔티티임)
	private final CabinetPlace cabinetPlace;
	private final LocalDateTime lentExpirationDate;
	private final int daysAfterExpiration;
}
