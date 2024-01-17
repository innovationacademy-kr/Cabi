package org.ftclub.cabinet.admin.dto;

import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AdminClubUserRequestDto {

	@NotNull
	private String clubName;
}
