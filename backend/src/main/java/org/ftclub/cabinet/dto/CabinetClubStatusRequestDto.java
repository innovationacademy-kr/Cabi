package org.ftclub.cabinet.dto;

import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CabinetClubStatusRequestDto {

	private final Long userId;
	@NotNull
	private final Long cabinetId;
	@NotNull
	private final String statusNote;
}
