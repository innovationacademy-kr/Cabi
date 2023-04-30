package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Date;

@AllArgsConstructor
@Getter
public class LentsStatisticsResponseDto {
    private final Date startDate;
    private final Date endDate;
    private final Integer lentStartCount;
    private final Integer lentEndCount;
}
