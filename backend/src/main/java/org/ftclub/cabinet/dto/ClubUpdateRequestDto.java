package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ClubUpdateRequestDto {

	private String clubName;
	private String clubMasterName;

	public boolean isClubNameChanged() {
		return clubName != null && !clubName.isEmpty();
	}

	public boolean isClubMasterNameChanged() {
		return clubMasterName != null && !clubMasterName.isEmpty();
	}
}
