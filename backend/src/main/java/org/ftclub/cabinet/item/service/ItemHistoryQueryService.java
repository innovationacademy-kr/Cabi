package org.ftclub.cabinet.item.service;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.item.repository.ItemHistoryRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemHistoryQueryService {

	private final ItemHistoryRepository itemHistoryRepository;

	public List<ItemHistory> findAllItemHistoryByUser(Long userId) {
		return itemHistoryRepository.getAllUnusedItemHistoryByUser(userId);
	}

	public List<ItemHistory> getItemHistoryWithItem(Long userId,
		LocalDateTime start, LocalDateTime end) {
		return itemHistoryRepository.findAllByUserIdAndUsedAtJoinItem(userId, start, end);
	}

	public List<ItemHistory> getCoinHistoryOnItems(Long userId,
		LocalDateTime start, LocalDateTime end, List<Long> itemIds) {
		return itemHistoryRepository.findAllByUserIdAndPurchaseAtAndItemIdIn(userId, start, end,
			itemIds);
	}

	public Long getCountByUserIdAndItemIdBetween(Long userId, Long itemId, LocalDateTime start,
		LocalDateTime end) {
		return itemHistoryRepository.getCountByUserIdAndItemIdBetween(userId, itemId, start, end);
	}

	public ItemHistory getFirstItemInInventory(Long userId, Long itemId) {
		return itemHistoryRepository.findFirstByUserIdAndItemIdAndUsedAtIsNull(userId, itemId)
			.orElseThrow(ExceptionStatus.NOT_FOUND_ITEM::asServiceException);
	}
}
