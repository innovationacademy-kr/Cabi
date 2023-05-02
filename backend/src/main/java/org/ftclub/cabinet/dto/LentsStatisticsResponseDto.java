package org.ftclub.cabinet.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LentsStatisticsResponseDto {

    private final Date startDate;
    private final Date endDate;
    private final Integer lentStartCount;
    private final Integer lentEndCount;
}
