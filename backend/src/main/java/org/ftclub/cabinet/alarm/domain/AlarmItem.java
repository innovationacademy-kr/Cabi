package org.ftclub.cabinet.alarm.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@RequiredArgsConstructor
public class AlarmItem implements ItemUsage {

	private final Long userId;
	private final Long cabinetPlaceId;
}
