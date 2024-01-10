package org.ftclub.cabinet.alarm.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * 대여 만료 알람
 */
@Getter
@ToString
@AllArgsConstructor
public class LentExpirationAlarm implements Alarm {

    private final Long daysLeftFromExpireDate;
}
