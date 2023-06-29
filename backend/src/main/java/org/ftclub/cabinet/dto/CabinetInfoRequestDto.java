package org.ftclub.cabinet.dto;

import javax.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class CabinetInfoRequestDto {

	@Size(max = 64)
	private String title;
	@Size(max = 64)
	private String memo;
}
