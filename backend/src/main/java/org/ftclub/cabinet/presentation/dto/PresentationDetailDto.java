package org.ftclub.cabinet.presentation.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;

@Getter
@AllArgsConstructor
public class PresentationDetailDto {

	private final Long id;
	private final String userName;
	private final Category category;
	private final LocalDateTime startTime;
	private final Duration duration;
	private final PresentationLocation presentationLocation;
	private final String title;
	private final String summary;
	private final String outline;
	private final String detail;
	private final String thumbnailLink;
	private final String videoLink;

	private final boolean recordingAllowed;
	private final boolean publicAllowed;

	private final Long likeCount;
	private final boolean likedByMe;
	private final boolean editAllowed;
	private final PresentationStatus presentationStatus;
}
