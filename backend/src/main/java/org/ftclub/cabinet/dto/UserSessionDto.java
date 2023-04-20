package org.ftclub.cabinet.dto;

import lombok.*
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserSessionDto extends UserDto {
    private Optional<Long> iat;
    private Optional<Long> ext;
    private Optional<Date> blackholedAt;
    private Optional<UserRole> role;
}
