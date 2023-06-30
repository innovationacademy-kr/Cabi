package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * startDate부터 endDate까지의 대여 시작 횟수와 종료 횟수를 반환하는 DTO입니다.
 */
@AllArgsConstructor
@Getter
public class LentsStatisticsResponseDto {

	private final LocalDateTime startDate;
	private final LocalDateTime endDate;
	private final Integer lentStartCount;
	private final Integer lentEndCount;
}
