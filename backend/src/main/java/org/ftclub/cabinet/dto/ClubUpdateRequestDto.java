package org.ftclub.cabinet.dto;

import javax.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.validator.constraints.Length;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ClubUpdateRequestDto {

	@NotBlank
	@Length(min = 1, max = 30)
	private String clubName;
	@NotBlank
	private String clubMaster;
}
