package org.ftclub.cabinet.dto;

import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@ToString
@Getter
public class CabinetClubStatusRequestDto {

	private final Long userId;
	@NotNull
	private final Long cabinetId;
	@NotNull
	private final String statusNote;
}
