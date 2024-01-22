package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class ClubResponseDto {

	private final Long clubId;
	private final String clubName;
	private final String clubMaster;
}
