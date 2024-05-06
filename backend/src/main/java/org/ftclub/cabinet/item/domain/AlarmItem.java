package org.ftclub.cabinet.item.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@RequiredArgsConstructor
public class AlarmItem implements ItemUsage {

	private final Long userId;
	private final Long cabinetPlaceId;
	private final SectionAlarmType sectionAlarmType;
}
