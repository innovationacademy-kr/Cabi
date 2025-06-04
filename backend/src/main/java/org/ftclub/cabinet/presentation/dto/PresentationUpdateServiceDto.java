package org.ftclub.cabinet.presentation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class PresentationUpdateServiceDto {

	private final String summary;
	private final String outline;
	private final String detail;
	private final boolean publicAllowed;
	private final boolean thumbnailUpdated;
}
