package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 대여 정보를 반환하는 DTO입니다.
 */
@AllArgsConstructor
@Getter
public class LentDto {

	private final Long userId;
	private final String name;
	private final Long lentHistoryId;
	private final LocalDateTime startedAt;
	private final LocalDateTime expiredAt;
}
