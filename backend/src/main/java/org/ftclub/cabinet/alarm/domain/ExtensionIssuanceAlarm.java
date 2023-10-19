package org.ftclub.cabinet.alarm.domain;

import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * 연장권 발급 알람
 */
@AllArgsConstructor
public class ExtensionIssuanceAlarm implements Alarm {
	private final String extensionName;
	private final LocalDateTime extensionExpirationDate;
	private final int daysToExtend; // .. ?
}
