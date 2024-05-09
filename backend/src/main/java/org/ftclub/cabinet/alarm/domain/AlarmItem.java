package org.ftclub.cabinet.alarm.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.item.domain.SectionAlarmType;

@Getter
@ToString
@RequiredArgsConstructor
public class AlarmItem implements ItemUsage {

	private final Long userId;
	private final Long cabinetPlaceId;
	private final SectionAlarmType sectionAlarmType;
}
