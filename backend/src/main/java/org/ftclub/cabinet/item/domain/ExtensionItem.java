package org.ftclub.cabinet.item.domain;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ExtensionItem implements ItemUsage {

	private final Long userId;
	private final Integer days;

}
