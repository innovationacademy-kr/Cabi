package org.ftclub.cabinet.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.cabinet.domain.Location;

/**
 * 사물함의 대여 기록을 반환하는 DTO입니다.
 */
@AllArgsConstructor
@Getter
public class LentHistoryDto {

	private final Long userId;
	private final String name;
	private final Long cabinetId;
	private final Integer visibleNum;
	@JsonUnwrapped
	private final Location location;
	private final Date startedAt;
	private final Date endedAt;
}
