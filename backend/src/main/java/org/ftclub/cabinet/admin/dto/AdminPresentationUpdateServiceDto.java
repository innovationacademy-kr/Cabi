package org.ftclub.cabinet.admin.dto;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;

@EqualsAndHashCode
@Getter
@ToString
@AllArgsConstructor
public class AdminPresentationUpdateServiceDto {

	private final Duration duration;
	private final Category category;

	private final String title;
	private final String summary;
	private final String outline;
	private final String detail;
	private final String videoLink;

	private final boolean recordingAllowed;
	private final boolean publicAllowed;
	private final boolean thumbnailUpdated;
}
