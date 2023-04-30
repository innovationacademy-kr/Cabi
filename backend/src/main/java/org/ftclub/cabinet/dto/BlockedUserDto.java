package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Date;

@AllArgsConstructor
@Getter
public class BlockedUserDto {
    private final Long userId;
    private final String name;
    private final Date bannedAt;
    private final Date unbannedAt;
}
