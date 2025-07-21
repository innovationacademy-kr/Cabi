package org.ftclub.cabinet.presentation.dto;

import lombok.Builder;
import lombok.Getter;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;

@Getter
@Builder
public class PresentationRegisterServiceDto {

	private final Duration duration;
	private final Category category;

	private final String title;
	private final String summary;
	private final String outline;
	private final String detail;

	private final boolean recordingAllowed;
	private final boolean publicAllowed;

	private final Long slotId;
}
