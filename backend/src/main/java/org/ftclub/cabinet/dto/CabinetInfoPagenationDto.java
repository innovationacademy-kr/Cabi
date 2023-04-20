package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CabinetInfoPagenationDto {
    /**
     * 기존 cabinetInfoPagenationDto를 변형했습니다.
     */
    private CabinetInfoResponseDto[] result;
    private Long totalLength;
}