package org.ftclub.cabinet.admin.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.jetbrains.annotations.NotNull;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AdminPresentationSlotRequestDto {

	@NotNull
	private LocalDateTime startTime;
	
	@NotNull
	private PresentationLocation location;
}
