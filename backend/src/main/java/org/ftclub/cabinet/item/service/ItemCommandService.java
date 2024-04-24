package org.ftclub.cabinet.item.service;

import java.time.LocalDateTime;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.item.repository.ItemHistoryRepository;
import org.ftclub.cabinet.item.repository.ItemRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemCommandService {

	private final ItemHistoryRepository itemHistoryRepository;

	public void purchaseItem(Long userId, Long itemId) {
		ItemHistory itemHistory = ItemHistory.of(userId, itemId, null);
		itemHistoryRepository.save(itemHistory);
	}
}
