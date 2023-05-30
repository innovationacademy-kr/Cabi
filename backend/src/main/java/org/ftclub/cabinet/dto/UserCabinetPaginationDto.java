package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserCabinetPaginationDto {

	private final List<UserCabinetDto> result;
	private final Integer totalLength;
}
