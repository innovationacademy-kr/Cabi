package org.ftclub.cabinet.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.cabinet.domain.Location;

@Getter
@ToString
@AllArgsConstructor
public class ClubInfoResponseDto {

	private final String clubName;
	private final String clubMaster;
	private final String clubMemo; // cabinet password
	private final String clubNotice;
	@JsonUnwrapped
	private final Location location;
	private final Long visibleNum;
	private final List<ClubUserResponseDto> clubUsers;
	private final Long clubUserCount;
}
