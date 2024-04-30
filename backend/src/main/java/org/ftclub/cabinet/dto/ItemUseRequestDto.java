package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ItemUseRequestDto {

	private Long newCabinetId; // 이사권 사용 시
	private String section;
	private Long cabinetPlaceId;
	// 알림권 -> 원하는 섹션?
}
