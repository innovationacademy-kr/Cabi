package org.ftclub.cabinet.admin.dto;

import java.util.Set;
import lombok.Builder;
import lombok.Getter;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;

@Getter
@Builder
public class AdminPresentationUpdateServiceDto {

	private final Category category;
	private final Duration duration;

	private final String title;
	private final String summary;
	private final String outline;
	private final String detail;
	private final String videoLink;

	private final boolean recordingAllowed;
	private final boolean publicAllowed;
	private final boolean thumbnailUpdated;

	private final Set<String> toUpdate = Set.of(
			"title", "category", "duration",
			"summary", "outline", "detail",
			"publicAllowed", "recordingAllowed", "videoLink"
	);
}
