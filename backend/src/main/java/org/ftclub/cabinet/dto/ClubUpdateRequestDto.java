package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.ToString;
import org.hibernate.validator.constraints.Length;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ClubUpdateRequestDto {

	@NonNull
	@Length(min = 1, max = 30)
	private String clubName;
	@NonNull
	private String clubMaster;
}
