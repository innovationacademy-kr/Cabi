package org.ftclub.cabinet.presentation.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;

@Getter
@AllArgsConstructor
public class PresentationSummaryDto {

	private final Long presentationId;
	private final LocalDateTime startTime;
	private final PresentationLocation presentationLocation;
	private final String title;
	private final String summary;
	private final Category category;
	private final String userName;
	private final String thumbnailLink;
	private final long likeCount;
	private final boolean likedByMe;
	private final PresentationStatus presentationStatus;

}
