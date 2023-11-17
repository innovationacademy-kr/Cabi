package org.ftclub.cabinet.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;

/**
 * 내가 대여 중인 사물함의 정보와 그 사물함의 대여 정보들을 반환하는 DTO입니다.
 */
@AllArgsConstructor
@Getter
public class MyCabinetResponseDto {

	private final Long cabinetId;
	private final Integer visibleNum;
	private final LentType lentType;
	private final Integer maxUser;
	private final String title;
	private final String memo;
	private final CabinetStatus status;
	private final String statusNote;
	@JsonUnwrapped
	private final Location location;
	private final List<LentDto> lents;
	// 공유사물함에 필요한 정보
	private final String shareCode;
	private final LocalDateTime sessionExpiredAt;
	private final String previousUserName;
}
