package org.ftclub.cabinet.item.service;

import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.item.repository.ItemHistoryRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemHistoryQueryService {

	private final ItemHistoryRepository itemHistoryRepository;

	public List<ItemHistory> findAllItemHistoryByUser(Long userId) {
		return itemHistoryRepository.getAllUnusedItemHistoryByUser(userId);
	}

	public Page<ItemHistory> getItemHistoryWithItem(Long userId, Pageable pageable) {
		return itemHistoryRepository.findAllByUserIdOnMinusPriceItemsWithSubQuery(userId, pageable);
	}

	public Page<ItemHistory> getItemHistoriesByUserIdWithItem(Long userId, Pageable pageable) {
		return itemHistoryRepository.findAllByUserId(userId, pageable);
	}

	public Page<ItemHistory> getCoinHistory(Long userId, Pageable pageable, List<Long> itemIds) {
		return itemHistoryRepository.findAllByUserIdAndItemIdIn(userId, pageable, itemIds);
	}

	public List<ItemHistory> getUnusedItemsInUserInventory(Long userId, Long itemId) {
		return itemHistoryRepository.findAllByUserIdAndItemIdAndUsedAtIsNull(userId, itemId);
	}

	public int getPurchaseCountByItemId(Long itemId) {
		return itemHistoryRepository.getCountByItemIds(itemId);
	}

	public List<ItemHistory> getUsedCoinHistoryBetween(
			LocalDate startDate,
			LocalDate endDate) {
		return itemHistoryRepository.findAllUsedAtIsNotNullBetween(startDate, endDate);
	}

	public List<ItemHistory> getCoinCollectedInfoByMonth(Long itemId, Integer year,
			Integer month) {
		return itemHistoryRepository.findCoinCollectInfoByMonth(itemId, year, month);
	}
}
