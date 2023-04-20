package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OverdueUserInfoPagenationDto {
    private OverdueUserCabinetInfoDto[] result;
    private Long totalLength;
}