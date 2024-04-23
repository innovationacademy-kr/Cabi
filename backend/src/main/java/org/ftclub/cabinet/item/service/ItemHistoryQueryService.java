package org.ftclub.cabinet.item.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.item.repository.ItemHistoryRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemHistoryQueryService {

    private final ItemHistoryRepository itemHistoryRepository;



    public List<ItemHistory> findItemHistory(Long userId, LocalDateTime start, LocalDateTime end) {
        return itemHistoryRepository.findItemHistory(userId, start, end);
    }
	public List<ItemHistory> getItemHistory(Long userId, LocalDateTime start, LocalDateTime end) {
		return null;
	}

	public List<ItemHistory> getCoinHistoryOnItem(Long userId,
			LocalDateTime start, LocalDateTime end, List<Long> itemIds) {
		return itemHistoryRepository.findAllByUserIdAndPurchaseAtAndItemIdIn(userId, start, end,
				itemIds);
	}
}
