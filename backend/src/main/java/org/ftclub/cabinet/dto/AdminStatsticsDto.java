package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdminStatisticsDto {
    private Date startDate;
    private Date endDate;
    private Long lentCount;
    private Long returnCount;
}