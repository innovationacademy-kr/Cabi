package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdminUserDto {
    private String email;
    private AdminRole role;
}