package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 유저의 정보와 로그인 세션 정보를 갖는 DTO입니다.
 */
@AllArgsConstructor
@Getter
public class UserSessionDto {

    private final Long userId;
    private final String name;
    private final String email;
    private final Integer tokenIssuedAt;
    private final Integer tokenExpiresAt;
    private final LocalDateTime blackHoledAt;
    private final Boolean isStaff;
}
