package org.ftclub.cabinet.admin.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;

@Getter
@AllArgsConstructor
public class AdminPresentationResponseDto {

	private Long presentationId;
	private Long slotId;
	private LocalDateTime startTime;
	private String title;
	private PresentationLocation location;
	private Boolean canceled;
}
