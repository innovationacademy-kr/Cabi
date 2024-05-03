package org.ftclub.cabinet.alarm.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class AvailableSectionAlarm implements Alarm {

	private final String building;
	private final Integer floor;
	private final String section;
}
