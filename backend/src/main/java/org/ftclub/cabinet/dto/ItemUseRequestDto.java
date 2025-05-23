package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.item.domain.ValidItemUse;


@Getter
@AllArgsConstructor
@NoArgsConstructor
@ValidItemUse
@ToString
public class ItemUseRequestDto {

	private Long newCabinetId; // 이사권 사용 시

	private String building;
	private Integer floor;
	private String section;
}
