package org.ftclub.cabinet.alarm.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.cabinet.domain.Location;

@Getter
@ToString
@AllArgsConstructor
public class AvailableSectionAlarm implements Alarm {

	private final Location location;
}
