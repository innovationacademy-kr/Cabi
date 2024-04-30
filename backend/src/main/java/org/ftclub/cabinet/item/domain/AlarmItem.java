package org.ftclub.cabinet.item.domain;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class AlarmItem implements ItemUsage {

	private final Long userId;
	private final String section;
}
