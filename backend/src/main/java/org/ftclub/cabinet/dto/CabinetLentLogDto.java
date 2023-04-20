package org.ftclub.cabinet.dto;

import lombok.*
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CabinetLentLogDto {
    private Long userId;
    private String name;
    private Long cabinetId;
    private Long visibleNum;
    private String building;
    private Integer floor;
    private String section;
    private Date startedAt;
    private Date endedAt;
}