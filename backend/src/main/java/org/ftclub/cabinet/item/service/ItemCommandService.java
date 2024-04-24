package org.ftclub.cabinet.item.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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
@Log4j2
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
		log.info("======================");
		log.info("{}", item);
		ItemHistory itemHistory = ItemHistory.of(dto.getUserId(), item.getId(), null);
		log.info("{}", itemHistory);
		itemHistoryRepository.save(
				itemHistory);
	}

}
