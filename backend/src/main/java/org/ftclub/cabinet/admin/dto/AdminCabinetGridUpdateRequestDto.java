package org.ftclub.cabinet.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@AllArgsConstructor
@Getter
public class AdminCabinetGridUpdateRequestDto {
	@NotNull
	private int row;
	@NotNull
	private int col;
}
