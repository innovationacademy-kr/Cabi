package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserCabinetInfoPagenationDto {
    private UserCabinetInfoDto[] result;
    private Long totalLength;
}