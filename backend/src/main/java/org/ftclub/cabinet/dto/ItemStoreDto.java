package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.ftclub.cabinet.item.domain.Sku;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ItemStoreDto {

	private Sku itemSku;
	private String itemName;
	private Integer itemPrice;
	private String itemTypes;
}
