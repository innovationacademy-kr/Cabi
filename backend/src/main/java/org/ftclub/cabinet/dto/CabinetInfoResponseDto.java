package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.Getter;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;

/**
 * 사물함 정보(CabinetDto)와 그 사물함의 대여 정보를 반환하는 DTO입니다.
 */
@Getter
public class CabinetInfoResponseDto extends CabinetDto {

	private final List<LentDto> lents;

	public CabinetInfoResponseDto(Long cabinetId, Integer visibleNum, LentType lentType,
			Integer maxUser, String title, CabinetStatus status, Location location,
			List<LentDto> lents) {
		super(cabinetId, visibleNum, lentType, maxUser, title, status, null, location);
		this.lents = lents;
	}
}
