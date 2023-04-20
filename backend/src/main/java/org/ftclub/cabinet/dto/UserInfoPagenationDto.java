package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserInfoPagenationDto {
    private UserInfoDto[] result;
    private Long totalLength;
}