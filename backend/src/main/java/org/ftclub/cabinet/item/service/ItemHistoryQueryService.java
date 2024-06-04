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

	public Page<ItemHistory> findItemHistoryWithItem(Long userId, Pageable pageable) {
		return itemHistoryRepository.findAllByUserIdOnMinusPriceItemsWithSubQuery(userId, pageable);
	}

	public Page<ItemHistory> findItemHistoriesByUserIdWithItem(Long userId, Pageable pageable) {
		return itemHistoryRepository.findAllByUserIdOrderByPurchaseAtDesc(userId, pageable);
	}

	public Page<ItemHistory> findCoinHistory(Long userId, Pageable pageable, List<Long> itemIds) {
		return itemHistoryRepository.findAllByUserIdAndItemIdIn(userId, pageable, itemIds);
	}

	public List<ItemHistory> findUnusedItemsInUserInventory(Long userId, Long itemId) {
		return itemHistoryRepository.findAllByUserIdAndItemIdAndUsedAtIsNull(userId, itemId);
	}

	public int findPurchaseCountByItemId(Long itemId) {
		return itemHistoryRepository.getCountByItemIds(itemId);
	}

	public List<ItemHistory> findUsedCoinHistoryBetween(
			LocalDate startDate,
			LocalDate endDate) {
		return itemHistoryRepository.findAllUsedAtIsNotNullBetween(startDate, endDate);
	}

	public List<ItemHistory> findCoinCollectedInfoByMonth(Long itemId, Integer year,
			Integer month) {
		return itemHistoryRepository.findCoinCollectInfoByIdAtYearAndMonth(itemId, year, month);
	}
}
