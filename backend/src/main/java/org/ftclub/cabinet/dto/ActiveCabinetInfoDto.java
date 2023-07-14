package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.user.domain.UserRole;

import java.time.LocalDateTime;

/**
 * 현재 대여 기록의 모든 연관관계를 담는 내부 계층 간 DTO
 */
@AllArgsConstructor
@Getter
@ToString
public class ActiveCabinetInfoDto {
	private final Long cabinetId;
	private final Long lentHistoryId;
	private final Long userId;
	private final String name;
	private final String email;
	private final LocalDateTime blackholedAt;
	private final LocalDateTime deletedAt;
	private final UserRole role;
	private final LocalDateTime startedAt;
	private final LocalDateTime expiredAt;
	private final LocalDateTime endedAt;
	private final Integer visibleNum;
	private final CabinetStatus status;
	private final LentType lentType;
	private final Integer maxUser;
	private final String statusNote;
	private final Grid grid;
	private final String title;
	private final String memo;
	private final Location location; // CabinetPlace의 formation, mapArea를 현재는 사용하지 않음.
}
