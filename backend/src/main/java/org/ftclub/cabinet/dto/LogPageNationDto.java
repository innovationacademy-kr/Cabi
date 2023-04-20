package org.ftclub.cabinet.dto;

import lombok.*
@AllArgsConstructor
@NoArgsConstructor
@Data
public class LogPagenationDto {
    /**
     * NOTE:
     * 이름의 통일성을 위해 CabinetLentLogPagenationDto로 수정하는 것이 어떤지?
     */
    private CabinetLentLogDto[] result;
    private Long totalLength;
}