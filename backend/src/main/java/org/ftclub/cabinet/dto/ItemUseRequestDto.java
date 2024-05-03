package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.item.domain.SectionAlarmType;

@Getter
@AllArgsConstructor
public class ItemUseRequestDto {

	private Long newCabinetId; // 이사권 사용 시
	private Long cabinetPlaceId; // 알림권 사용 시
	private SectionAlarmType sectionAlarmType; // 알림권 사용 시
}
