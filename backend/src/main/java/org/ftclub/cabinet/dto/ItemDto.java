package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ItemDto {

	private Long itemId;
	private String itemName;
	private Integer itemPrice;
	private String itemType;
}
