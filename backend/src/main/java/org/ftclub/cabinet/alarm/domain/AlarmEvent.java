package org.ftclub.cabinet.alarm.domain;

import lombok.Getter;

@Getter
public class AlarmEvent {
	private final Long id;
	private final Alarm alarm;

	private AlarmEvent(Long id, Alarm alarm) {
		this.id = id;
		this.alarm = alarm;
	}

	public static AlarmEvent of(Long id, Alarm alarm) {
		return new AlarmEvent(id, alarm);
	}
}
