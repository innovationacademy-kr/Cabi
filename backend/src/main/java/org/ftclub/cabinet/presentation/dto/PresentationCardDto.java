package org.ftclub.cabinet.presentation.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;

@Getter
@AllArgsConstructor
@Builder
public class PresentationCardDto {

	// presentation entity info
	private final Long presentationId;
	private final LocalDateTime startTime;
	private final PresentationLocation presentationLocation;
	private final String title;
	private final String summary;
	private final Category category;

	// calculated info from presentation
	private final String thumbnailS3Key;
	private final PresentationStatus presentationStatus;
	// user info
	private final String userName;

	// like info
	private final Long likeCount;
	private final boolean likedByMe;
}
