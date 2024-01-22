package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.ToString;
import org.hibernate.validator.constraints.Length;

@ToString
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ClubCreateDto {

	@Length
	@NonNull
	@Length(min = 1, max = 30)
	private String clubName;
	@NonNull
	private String clubMasterName;
}
