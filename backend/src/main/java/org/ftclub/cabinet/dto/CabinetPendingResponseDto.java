package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public class CabinetPendingResponseDto {

	private final List<List<CabinetPreviewDto>> cabinetInfoResponseDtos;
}
