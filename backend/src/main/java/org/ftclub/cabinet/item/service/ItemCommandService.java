package org.ftclub.cabinet.item.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.item.domain.ItemType;
import org.ftclub.cabinet.item.domain.Sku;
import org.ftclub.cabinet.item.repository.ItemHistoryRepository;
import org.ftclub.cabinet.item.repository.ItemRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Logging(level = LogLevel.DEBUG)
public class ItemCommandService {

	private final ItemHistoryRepository itemHistoryRepository;
	private final ItemRepository itemRepository;

	public void purchaseItem(Long userId, Long itemId) {
		ItemHistory itemHistory = ItemHistory.of(userId, itemId, null);
		itemHistoryRepository.save(itemHistory);
	}

	public void createItem(Integer price, Sku sku, ItemType type) {
		itemRepository.save(Item.of(price, sku, type));
	}

	public void assignItem(Long userId, Long itemId) {
		ItemHistory itemHistory = ItemHistory.of(userId, itemId, null);
		itemHistoryRepository.save(itemHistory);
	}

}
