package org.ftclub.cabinet.item.service;

import static org.ftclub.cabinet.exception.ExceptionStatus.ITEM_NOT_FOUND;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.Sku;
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
		return itemRepository.findAll();
	}

	public Item getItemById(Long itemId) {
		Optional<Item> item = itemRepository.findById(itemId);
		return item.orElseThrow(ITEM_NOT_FOUND::asServiceException);
	}

	public List<Item> getItemsByIds(List<Long> itemIds) {
		return Optional.of(itemRepository.findAllById(itemIds))
			.orElseThrow(ITEM_NOT_FOUND::asServiceException);
	}

//	public Item getItem()

	public List<Item> getEarnItemIds() {
		return itemRepository.findAllByPricePositive();
	}

	public List<Item> getUseItemIds() {
		return itemRepository.findAllByPriceNegative();
	}

	public Item getBySku(Sku sku) {
		return itemRepository.findBySku(sku)
			.orElseThrow(ExceptionStatus.NOT_FOUND_ITEM::asServiceException);
	}
}
