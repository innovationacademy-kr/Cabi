package org.ftclub.cabinet.admin.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;

@Getter
@ToString
@AllArgsConstructor
public class PresentationSlotRegisterServiceDto {

	private LocalDateTime startTime;
	private PresentationLocation location;
}