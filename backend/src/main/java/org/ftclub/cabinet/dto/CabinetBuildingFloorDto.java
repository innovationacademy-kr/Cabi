package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CabinetBuildingFloorDto {
    /**
     * location이라는 필드가 building으로 바뀌었으므로 CabinetBuildingFloorDto로 변경했습니다.
     */
    private String building;
    private Integer floor;
    private Optional<LentDto[]> lentInfo;
}