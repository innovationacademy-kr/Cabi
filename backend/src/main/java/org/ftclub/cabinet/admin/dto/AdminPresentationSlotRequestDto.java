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

	// todo: 이상한 값 들어왔을때 예외처리 해야함
	@NotNull
	private PresentationLocation location;
}
