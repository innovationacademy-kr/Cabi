package org.ftclub.cabinet.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LentDto {

    private final Long userId;
    private final String name;
    private final Long lentHistoryId;
    private final Date startedAt;
    private final Date expiredAt;
}
