package org.ftclub.cabinet.dto;

import java.util.Comparator;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.ftclub.cabinet.item.domain.ItemType;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class ItemStoreDto {

	private String itemName;
	private ItemType itemType;
	private String description;
	private List<ItemDetailsDto> items;

	//SKU 기준 오름차순 정렬
	public void sortBySkuASC() {
		items.sort(Comparator.comparing(ItemDetailsDto::getItemSku));
	}
}
