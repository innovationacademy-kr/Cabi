package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 서비스에 존재하는 모든 건물들과 그 건물들의 층 정보입니다.
 */
@AllArgsConstructor
@Getter
public class BuildingFloorsResponseDto {

	private final List<BuildingFloorsDto> result;

}
