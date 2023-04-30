package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Date;

@AllArgsConstructor
@Getter
public class LentDto {
    private final Long userId;
    private final String intraId;
    private final Long lentHistoryId;
    private final Date startedAt;
    private final Date expiredAt;
}
