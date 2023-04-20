package org.ftclub.cabinet.dto.response;

import lombok.*
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserLentResponseDto extends UserDto {
    private Long cabinetId;
}
