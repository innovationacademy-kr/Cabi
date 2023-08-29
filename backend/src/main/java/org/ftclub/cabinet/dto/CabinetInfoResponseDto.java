package org.ftclub.cabinet.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;

/**
 * 사물함 정보(CabinetDto)와 그 사물함의 대여 정보를 반환하는 DTO입니다.
 */
@AllArgsConstructor
@Getter
@ToString
public class CabinetInfoResponseDto {

	private final Long cabinetId;
	private final Integer visibleNum;
	private final LentType lentType;
	private final Integer maxUser;
	private final String title;
	private final CabinetStatus status;
	private final String statusNote;
	@JsonUnwrapped
	private final Location location;
	private final List<LentDto> lents;
	private final LocalDateTime sessionExpiredAt;

	public static boolean isValid(CabinetInfoResponseDto dto) {
		return (dto != null && dto.cabinetId != null && dto.visibleNum != null && dto.lentType != null
				&& dto.maxUser != null && dto.title != null && dto.status != null
				&& dto.statusNote != null && dto.location != null && dto.lents != null)
				? true : false;
	}
}
