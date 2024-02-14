package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ClubInfoDto {

	private final Long clubId;
	private final String clubName;
	private final String clubMaster;
}

