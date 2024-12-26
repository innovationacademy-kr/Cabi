package org.ftclub.cabinet.alarm.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * 공지사항 알람
 */
@Getter
@AllArgsConstructor
@ToString
public class AnnouncementAlarm implements Alarm, TransactionalAlarmEvent {

	private final String announcementContent;
}
