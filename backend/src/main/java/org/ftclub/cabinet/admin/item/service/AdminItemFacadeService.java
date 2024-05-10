package org.ftclub.cabinet.admin.item.service;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemType;
import org.ftclub.cabinet.item.domain.Sku;
import org.ftclub.cabinet.item.service.ItemCommandService;
import org.ftclub.cabinet.item.service.ItemHistoryCommandService;
import org.ftclub.cabinet.item.service.ItemQueryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminItemFacadeService {

	private final ItemQueryService itemQueryService;
	private final ItemCommandService itemCommandService;
	private final ItemHistoryCommandService itemHistoryCommandService;

	@Transactional
	public void createItem(Integer Price, Sku sku, ItemType type) {
		itemCommandService.createItem(Price, sku, type);
	}

	@Transactional
	public void assignItem(List<Long> userIds, Sku sku) {
		Item item = itemQueryService.getBySku(sku);
		LocalDateTime now = null;
		if (item.getPrice() > 0) {
			now = LocalDateTime.now();
		}
		itemHistoryCommandService.purchaseItem(userIds, item.getId(), now);
	}
}
