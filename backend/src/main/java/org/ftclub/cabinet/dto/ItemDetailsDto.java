package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.item.domain.Sku;

@Getter
@ToString
@AllArgsConstructor
public class ItemDetailsDto {

	private Sku itemSku;
	private Integer itemPrice;
	private String itemDetails; // 연장권 종류 - 3, 15, 31일, 패널티 종류 - 3, 7, 31일
}
