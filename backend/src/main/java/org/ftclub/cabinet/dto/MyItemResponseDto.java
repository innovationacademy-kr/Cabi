package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class MyItemResponseDto {

	List<ItemDto> extensionItems;
	List<ItemDto> exchangeItems;
	List<ItemDto> alarmItems;
	List<ItemDto> penaltyItems;
}
