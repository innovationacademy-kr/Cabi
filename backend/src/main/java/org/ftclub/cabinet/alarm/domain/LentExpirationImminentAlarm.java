package org.ftclub.cabinet.alarm.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * 대여 만료 임박 알람
 */
@Getter
@ToString
@AllArgsConstructor
public class LentExpirationImminentAlarm implements Alarm, TransactionalAlarmEvent {

	private final Long daysAfterFromExpireDate;
}
