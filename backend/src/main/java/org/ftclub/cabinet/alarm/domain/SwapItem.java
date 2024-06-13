package org.ftclub.cabinet.alarm.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class SwapItem implements ItemUsage {

	private final Long userId;
	private final Long newCabinetId;

}
