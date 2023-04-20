package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CabinetFloorDto {
    private Integer floor;
    private Integer total;
    private Integer used;
    private Integer overdue;
    private Integer unused;
    private Integer disabled;
}