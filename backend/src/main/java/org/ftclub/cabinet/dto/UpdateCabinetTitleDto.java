package org.ftclub.cabinet.dto;

import javax.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateCabinetTitleDto {

	@Size(max = 64)
	private String cabinetTitle;
}
