package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BrokenCabinetInfoPagenationDto {
    private BrokenCabinetInfoDto[] result;
    private Long totalLength;
}