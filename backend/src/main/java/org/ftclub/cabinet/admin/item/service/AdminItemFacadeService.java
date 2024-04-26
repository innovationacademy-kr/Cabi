package org.ftclub.cabinet.admin.item.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemType;
import org.ftclub.cabinet.item.domain.Sku;
import org.ftclub.cabinet.item.service.ItemCommandService;
import org.ftclub.cabinet.item.service.ItemHistoryCommandService;
import org.ftclub.cabinet.item.service.ItemQueryService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminItemFacadeService {

	private final ItemQueryService itemQueryService;
	private final ItemCommandService itemCommandService;
	private final ItemHistoryCommandService itemHistoryCommandService;

	public void createItem(Integer Price, Sku sku, ItemType type) {
		itemCommandService.createItem(Price, sku, type);
	}

	public void assignItem(Long userId, Sku sku) {
		Item item = itemQueryService.getItemBySku(sku);
		itemHistoryCommandService.purchaseItem(userId, item.getId());
	}
}
