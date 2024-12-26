package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CabinetSimplePaginationDto {

	private final List<CabinetSimpleDto> result;
	private final Long totalLength;
}
