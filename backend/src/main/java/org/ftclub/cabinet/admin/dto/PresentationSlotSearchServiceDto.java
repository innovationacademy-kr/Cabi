package org.ftclub.cabinet.admin.dto;

import javax.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PresentationSlotSearchServiceDto {

	private int year;
	private int month;
	@Pattern(regexp = "available", message = "status는 'available'만 허용됩니다.")
	private String status;

}
