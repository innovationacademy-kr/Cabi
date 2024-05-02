package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.ftclub.cabinet.item.domain.ItemType;
import org.ftclub.cabinet.item.domain.Sku;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class ItemDto {

	private Sku itemSku;
	private String itemName;
	private ItemType itemType;
	private Integer itemPrice;
	private String itemDetails;
}
