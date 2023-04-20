package org.ftclub.cabinet.dto.response;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CabinetInfoResponseDto extends CabinetDto {
    /**
     * FIXME:
     * 위치 정보 수정
     */
    private String building;
    private Integer floor;
    private Optional<LentDto[]> lentInfo; // Optional 처리를 따로 해야하는지?
}