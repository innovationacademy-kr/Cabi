package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BrokenCabinetInfoDto {
    private Long cabinetId;
    private Integer visibleNum;
    private LentType lentType;
    private String note; // 고장 사유
    private Integer maxUser;
    private String section;
    private String building;
    private Integer floor;
}