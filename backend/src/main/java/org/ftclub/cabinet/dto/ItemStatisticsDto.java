package org.ftclub.cabinet.dto;


import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ItemStatisticsDto {

	private List<ItemPurchaseCountDto> items;
}
