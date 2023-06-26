package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * 구역에 있는 모든 사물함의 CabinetInfoResponseDto를 반환하는 DTO입니다.
 */
@AllArgsConstructor
@Getter
@ToString
public class CabinetsPerSectionResponseDto {

	private final String section;
	private final List<CabinetPreviewDto> cabinets;
}
