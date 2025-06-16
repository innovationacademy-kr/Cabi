package org.ftclub.cabinet.admin.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PresentationSlotResponseDto {

	private Long slotId;
	private LocalDateTime startTime;
	private PresentationLocation location;
}
