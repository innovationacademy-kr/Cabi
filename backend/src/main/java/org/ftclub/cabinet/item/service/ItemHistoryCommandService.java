package org.ftclub.cabinet.item.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.item.repository.ItemHistoryRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemHistoryCommandService {

	private final ItemHistoryRepository itemHistoryRepository;

	public void createItemHistory(Long userId, Long itemId) {
		ItemHistory itemHistory = ItemHistory.of(userId, itemId, null);
		itemHistoryRepository.save(itemHistory);
	}

	public void createItemHistories(List<Long> userIds, Long itemId, LocalDateTime usedAt) {
		List<ItemHistory> itemHistories = userIds.stream()
				.map(userId -> ItemHistory.of(userId, itemId, usedAt))
				.collect(Collectors.toList());
		itemHistoryRepository.saveAll(itemHistories);
	}
}
