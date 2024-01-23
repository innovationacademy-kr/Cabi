package org.ftclub.cabinet.dto;


import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ClubDeleteDto {

	@NotNull
	private Long clubId;
}
