package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class LentHistoryPaginationDto {
    private final List<LentHistoryDto> result;
    private final Integer totalLength;
}