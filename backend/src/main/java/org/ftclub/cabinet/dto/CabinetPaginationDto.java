package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;


@AllArgsConstructor
@Getter
public class CabinetPaginationDto {

	private final List<CabinetDto> result;
	private final Integer totalPage;
}
