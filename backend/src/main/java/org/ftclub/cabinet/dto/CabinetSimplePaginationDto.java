package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CabinetSimplePaginationDto {
	private final List<CabinetSimpleDto> result;
	private final Long totalLength;
}
