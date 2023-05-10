package org.ftclub.cabinet.dto;

import lombok.Getter;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;

/**
 * 사물함 정보(CabinetDto)와 그 사물함의 메모를 반환하는 DTO입니다.
 */
@Getter
public class CabinetWithMemoDto extends CabinetDto {

	private final String memo;

	public CabinetWithMemoDto(
			Long cabinetId,
			Integer visibleNum,
			LentType lentType,
			Integer maxUser,
			String title,
			CabinetStatus status,
			Location location,
			String memo) {
		super(cabinetId, visibleNum, lentType, maxUser, title, status, location);
		this.memo = memo;
	}
}
