package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.item.domain.Sku;

@Getter
@AllArgsConstructor
public class ItemAssignResponseDto {

	private Sku itemSku; // sku
	private String itemName; // itemType
	private String itemDetails; // sku.description
	private LocalDateTime issuedDate; // itemHistory -> purchasedAt
}
