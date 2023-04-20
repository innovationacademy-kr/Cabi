package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BlockedUserInfoPagenationDto {
    private BlockedUserInfoDto[] result;
    private Long totalLength;
}