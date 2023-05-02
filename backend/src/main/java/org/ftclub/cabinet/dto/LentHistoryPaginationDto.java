package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LentHistoryPaginationDto {

    private final List<LentHistoryDto> result;
    private final Integer totalLength;
}
