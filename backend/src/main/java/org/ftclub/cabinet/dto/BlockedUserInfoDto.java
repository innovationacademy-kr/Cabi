package org.ftclub.cabinet.dto;

import lombok.*

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BlockedUserInfoDto {
    private Long userId;
    private String name;
    private Date bannedAt;
    private Date unbannedAt;
}