package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ItemPurchaseCountDto {

	private String itemName;
	private String itemDetails;
	private int userCount;
}
