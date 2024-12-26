package org.ftclub.cabinet.alarm.domain;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * 연장권 발급 알람
 */
@AllArgsConstructor
@ToString
@Getter
public class ExtensionIssuanceAlarm implements Alarm, TransactionalAlarmEvent {

	private final String extensionName;
	private final LocalDateTime extensionExpirationDate;
	private final Integer daysToExtend;
}
