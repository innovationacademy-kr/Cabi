package org.ftclub.cabinet.alarm.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 연장 만료 임박 알람
 */
@AllArgsConstructor
@Getter
public class ExtensionExpirationImminentAlarm implements Alarm {

	private final String extensionName;
	private final LocalDateTime extensionExpirationDate;
}
