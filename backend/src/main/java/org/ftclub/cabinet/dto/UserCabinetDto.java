package org.ftclub.cabinet.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserCabinetDto {

	@JsonUnwrapped
	UserBlockedInfoDto userInfo;
	CabinetDto cabinetInfo;
}
