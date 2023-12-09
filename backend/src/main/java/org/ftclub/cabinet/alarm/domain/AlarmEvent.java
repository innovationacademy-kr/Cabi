package org.ftclub.cabinet.alarm.domain;

import lombok.Getter;

@Getter
public class AlarmEvent {
	private final Long receiverId;
	private final Alarm alarm;

	private AlarmEvent(Long receiverId, Alarm alarm) {
		this.receiverId = receiverId;
		this.alarm = alarm;
	}

	public static AlarmEvent of(Long id, Alarm alarm) {
		return new AlarmEvent(id, alarm);
	}
}
