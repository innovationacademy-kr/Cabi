package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.valid.ItemUseValidation;

@Getter
@AllArgsConstructor
@ItemUseValidation
public class ItemUseRequestDto {

	private Long newCabinetId; // 이사권 사용 시

	// 알림권 사용시 사물함 구역 정보
	private String building;
	private Integer floor;
	private String section;
}
