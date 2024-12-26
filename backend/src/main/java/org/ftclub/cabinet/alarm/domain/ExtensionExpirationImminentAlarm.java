package org.ftclub.cabinet.alarm.domain;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * 연장 만료 임박 알람
 */
@Getter
@ToString
@AllArgsConstructor
public class ExtensionExpirationImminentAlarm implements Alarm, TransactionalAlarmEvent {

	private final String extensionName;
	private final LocalDateTime extensionExpirationDate;
}
