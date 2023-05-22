package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 사물함의 대여 기록을 반환하는 DTO입니다. user의 id, name, email, cabinet의 id, 대여가 만료되었는지 여부, 만료까지 남은 일수를 반환합니다.
 */
@AllArgsConstructor
@Getter
public class LentHistoryWithNameExpirationDto {

    private final Long userId;
    private final String name;
    private final String email;
    private final Long cabinetId;
    private final Boolean isExpired;
    private final Long daysLeftFromExpireDate;
}
