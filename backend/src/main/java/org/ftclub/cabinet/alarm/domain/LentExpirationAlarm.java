package org.ftclub.cabinet.alarm.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 대여 만료 알람
 */
@Getter
@AllArgsConstructor
public class LentExpirationAlarm implements Alarm, TransactionalAlarmEvent {

	private final Long daysLeftFromExpireDate;
}
