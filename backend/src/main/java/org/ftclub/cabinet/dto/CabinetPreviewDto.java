package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;

@AllArgsConstructor
@Getter
@ToString
public class CabinetPreviewDto {

	private final Long cabinetId;
	private final Integer visibleNum;
	private final String title;
	private final LentType lentType;
	private final Integer maxUser;
	private final CabinetStatus status;
	private final Integer userCount;
}
