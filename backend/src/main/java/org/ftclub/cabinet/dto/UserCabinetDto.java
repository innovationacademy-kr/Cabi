package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserCabinetDto {

	List<BlockedUserDto> userInfo;
	CabinetDto cabinetInfo;
}
