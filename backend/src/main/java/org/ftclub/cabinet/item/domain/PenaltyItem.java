package org.ftclub.cabinet.item.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PenaltyItem implements ItemUsage {

	private final Long userId;
	private final Integer days;
}
