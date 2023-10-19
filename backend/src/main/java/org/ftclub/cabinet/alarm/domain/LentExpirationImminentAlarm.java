package org.ftclub.cabinet.alarm.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 대여 만료 임박 알람
 */
@Getter
@AllArgsConstructor
public class LentExpirationImminentAlarm implements Alarm {

	private final Long daysAfterFromExpireDate;
}
