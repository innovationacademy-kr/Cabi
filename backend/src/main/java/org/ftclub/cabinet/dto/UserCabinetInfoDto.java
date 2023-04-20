package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserCabinetInfoDto {
    private Optional<BlockedUserInfoDto[]> userInfo; // Optional 처리를 따로 해야하는지?
    private Optional<CabinetLocationFloorDto[]> cabinetInfo;
}