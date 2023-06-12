package org.ftclub.cabinet.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.Size;

@Getter
@RequiredArgsConstructor
public class UpdateCabinetTitleDto {

	@Size(max = 64)
	private final String cabinetTitle;
}
