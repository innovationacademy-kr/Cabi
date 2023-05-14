package org.ftclub.cabinet.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;

/**
 * 사물함에 대한 정보입니다.
 */
@Getter
@AllArgsConstructor
public class CabinetDto {

	private final Long cabinetId;
	private final Integer visibleNum;
	private final LentType lentType;
	private final Integer maxUser;
	private final String title;
	private final CabinetStatus status;
	/**
	 * Location의 필드들을 CabinetDto의 필드로 포함시킵니다.
	 */
	@JsonUnwrapped
	private final Location location;
}
