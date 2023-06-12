package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * LentHistoryDto의 페이지네이션입니다.
 */
@AllArgsConstructor
@Getter
@ToString
public class LentHistoryPaginationDto {

	private final List<LentHistoryDto> result;
	private final Integer totalPage;
}
