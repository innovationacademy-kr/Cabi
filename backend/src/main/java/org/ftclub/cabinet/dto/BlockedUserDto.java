package org.ftclub.cabinet.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class BlockedUserDto {

    private final Long userId;
    private final String name;
    private final Date bannedAt;
    private final Date unbannedAt;
}
