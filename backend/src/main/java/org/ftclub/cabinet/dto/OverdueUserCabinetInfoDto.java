package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OverdueUserCabinetInfoDto {
    private String name;
    private Long cabinetId;
    private String building;
    private Integer overdueDays;
}