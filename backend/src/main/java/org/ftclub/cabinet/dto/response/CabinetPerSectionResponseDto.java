package org.ftclub.cabinet.dto.response;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CabinetsPerSectionResponseDto {
    /**
     * FIXME:
     * 위치 정보 수정
     */
    private String section;
    private CabinetInfoResponseDto[] cabinets;
}