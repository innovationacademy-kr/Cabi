package org.ftclub.cabinet.presentation.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;

@Getter
@AllArgsConstructor
public class PresentationMyListDto {

	private final Long presentationId;
	private final LocalDateTime startTime;
	private final PresentationLocation presentationLocation;
	private final String title;
	private final PresentationStatus presentationStatus;
}
