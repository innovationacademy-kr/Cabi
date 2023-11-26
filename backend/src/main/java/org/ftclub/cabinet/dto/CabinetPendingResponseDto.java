package org.ftclub.cabinet.dto;

import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public class CabinetPendingResponseDto {

	private final Map<Integer, List<CabinetPreviewDto>> cabinetInfoResponseDtos;
}
