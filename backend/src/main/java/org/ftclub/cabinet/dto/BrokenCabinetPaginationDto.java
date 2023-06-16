package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * BrokenCabinetDto의 페이지네이션입니다.
 */
@AllArgsConstructor
@Getter
public class BrokenCabinetPaginationDto {

	private final List<CabinetDto> result;
	private final Integer totalPage;
}
