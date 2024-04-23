package org.ftclub.cabinet.item.service;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.CoinHistoryResponseDto;
import org.ftclub.cabinet.dto.ItemHistoryResponseDto;
import org.ftclub.cabinet.dto.ItemPaginationDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.item.domain.CoinHistoryType;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemFacadeService {

	private final ItemQueryService itemQueryService;
	private final ItemCommandService itemCommandService;
	private final ItemHistoryQueryService itemHistoryQueryService;
	private final ItemHistoryCommandService itemHistoryCommandService;

	@Transactional
	public ItemPaginationDto getItems() {
		List<Item> allItems = ItemQueryService.getAllItems();
		return null;
	}

	@Transactional(readOnly = true)
	public void getMyItems(UserSessionDto user) {

	}

	@Transactional(readOnly = true)
	public ItemHistoryResponseDto getItemHistory(Long userId,
			LocalDateTime start, LocalDateTime end) {
		return null;
	}

	@Transactional(readOnly = true)
	public CoinHistoryResponseDto getCoinHistory(Long userId, CoinHistoryType type,
			LocalDateTime start, LocalDateTime end) {
		return null;
	}
}
