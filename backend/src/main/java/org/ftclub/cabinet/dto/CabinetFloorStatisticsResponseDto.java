package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 층별 사물함들의 통계 정보입니다.
 */
@AllArgsConstructor
@Getter
public class CabinetFloorStatisticsResponseDto {

	private final Integer floor;
	private final Integer total;
	private final Integer used;
	private final Integer overdue;
	private final Integer unused;
	private final Integer disabled;
}
