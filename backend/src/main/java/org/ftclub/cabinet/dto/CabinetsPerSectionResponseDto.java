package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CabinetsPerSectionResponseDto {

    private final String section;
    private final List<CabinetInfoResponseDto> cabinets;
}
