package org.ftclub.cabinet.dto;

import java.util.List;
import javax.persistence.criteria.CriteriaBuilder.In;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * CabinetInfoResponseDto의 페이지네이션입니다.
 */
@AllArgsConstructor
@Getter
public class CabinetInfoPaginationDto {

	private final List<CabinetInfoResponseDto> result; // 캐비넷 정보 배열
	private final Long totalLength; // 총 페이지 수
}
