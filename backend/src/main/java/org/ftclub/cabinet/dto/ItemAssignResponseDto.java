package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ItemAssignResponseDto {

	Long total;
	private List<ItemAssignResponseDto> items;
}
