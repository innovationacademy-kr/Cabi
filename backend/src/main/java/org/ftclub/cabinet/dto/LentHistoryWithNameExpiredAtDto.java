package org.ftclub.cabinet.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 사물함의 대여 기록을 반환하는 DTO입니다. 연체기한을 포함합니다.
 */
@AllArgsConstructor
@Getter
public class LentHistoryWithNameExpiredAtDto {

    private final Long userId;
    private final String name;
    private final String email;
    private final Long cabinetId;
    private final Date startedAt;
    private final Date expiredAt;
    private final Date endedAt;
}
