package org.ftclub.cabinet.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@AllArgsConstructor
@Getter
public class AdminCabinetTitleUpdateRequestDto {
	@NotNull
	private String title;
}
