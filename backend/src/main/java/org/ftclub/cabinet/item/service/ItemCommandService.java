package org.ftclub.cabinet.item.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.ItemAssignDto;
import org.ftclub.cabinet.dto.ItemCreateDto;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemHistory;
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

	private final ItemRepository itemRepository;
	private final ItemHistoryRepository itemHistoryRepository;

	public void createItem(ItemCreateDto dto) {
		itemRepository.save(
				Item.of(dto.getName(), dto.getPrice(), dto.getSku(), dto.getDescription(),
						dto.getType()));
	}

	public void assignItem(ItemAssignDto dto) {
		Item item = itemRepository.findBySku(dto.getItemSku());
		ItemHistory itemHistory = ItemHistory.of(dto.getUserId(), item.getId(), null);
		itemHistoryRepository.save(
				itemHistory);
	}

}
