package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.ftclub.cabinet.item.domain.ItemType;
import org.ftclub.cabinet.item.domain.Sku;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ItemCreateDto {

	private Integer price;
	private Sku sku;
	private ItemType type;
}
