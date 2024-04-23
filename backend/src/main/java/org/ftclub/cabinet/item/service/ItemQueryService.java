package org.ftclub.cabinet.item.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.repository.ItemRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemQueryService {

	private final ItemRepository itemRepository;

	public List<Item> getAllItems() {
		return itemRepository.findAllItems();
	}

//	public Item getItem()

	public List<Item> getEarnItemIds() {
		return itemRepository.findAllByPricePositive();
	}

	public List<Item> getUseItemIds() {
		return itemRepository.findAllByPricePositive();
	}
}
