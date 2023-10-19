package org.ftclub.cabinet.alarm.domain;

import lombok.AllArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;

import java.time.LocalDateTime;

/**
 * 대여 만료 임박 알람
 */
@AllArgsConstructor
public class LentExpirationImminentAlarm implements Alarm {
	private final CabinetPlace cabinetPlace;
	private final LocalDateTime lentExpirationDate;
}
