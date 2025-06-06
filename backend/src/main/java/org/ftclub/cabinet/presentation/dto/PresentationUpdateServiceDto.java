package org.ftclub.cabinet.presentation.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PresentationUpdateServiceDto {

	private final String summary;
	private final String outline;
	private final String detail;
	private final boolean publicAllowed;
	private final boolean thumbnailUpdated;
}
