package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class CabinetsPerSectionResponseDto {
    private final String section;
    private final List<CabinetInfoResponseDto> cabinets;
}
