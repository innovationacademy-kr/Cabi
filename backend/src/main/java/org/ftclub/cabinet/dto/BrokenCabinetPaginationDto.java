package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class BrokenCabinetPaginationDto {
    private final List<BrokenCabinetDto> result;
    private final Integer totalLength;
}
