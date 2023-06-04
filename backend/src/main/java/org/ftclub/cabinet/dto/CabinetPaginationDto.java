package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;


@AllArgsConstructor
@Getter
public class CabinetPaginationDto {

	private final List<CabinetDto> cabinets;
	private final Integer totalPage;
}
