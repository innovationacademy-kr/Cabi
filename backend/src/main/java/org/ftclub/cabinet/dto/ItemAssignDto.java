package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.item.domain.Sku;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ItemAssignDto {

	private Sku itemSku;
	private Long userId;
}
