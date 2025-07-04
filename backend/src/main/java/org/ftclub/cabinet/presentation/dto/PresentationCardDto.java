package org.ftclub.cabinet.presentation.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;

@Getter
@AllArgsConstructor
public class PresentationCardDto {

	// presentation entity info
	private final Long presentationId;
	private final LocalDateTime startTime;
	private final PresentationLocation presentationLocation;
	private final String title;
	private final String summary;
	private final Category category;

	// calculated info from presentation
	private final String thumbnailLink;
	private final PresentationStatus presentationStatus; //Enum type -> get current status로 만들어두셨는데 아직 push안됨.
	// user info
	private final String userName;

	// like info
	private final Long likeCount;
	private final boolean likedByMe;
}
