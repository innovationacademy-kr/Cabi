package org.ftclub.cabinet.item.service;

import static org.ftclub.cabinet.item.domain.CoinHistoryType.ALL;
import static org.ftclub.cabinet.item.domain.CoinHistoryType.EARN;
import static org.ftclub.cabinet.item.domain.CoinHistoryType.USE;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.CoinHistoryDto;
import org.ftclub.cabinet.dto.CoinHistoryResponseDto;
import org.ftclub.cabinet.dto.ItemHistoryResponseDto;
import org.ftclub.cabinet.dto.ItemPaginationDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.item.domain.CoinHistoryType;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.ItemMapper;
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
	private final ItemMapper itemMapper;

	@Transactional
	public ItemPaginationDto getItems() {
		List<Item> allItems = itemQueryService.getAllItems();
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
		List<Item> items = new ArrayList<>();
		if (type.equals(EARN) || type.equals(ALL)) {
			items.addAll(itemQueryService.getEarnItemIds());
		}
		if (type.equals(USE) || type.equals(ALL)) {
			items.addAll(itemQueryService.getUseItemIds());
		}
		List<Long> itemIds = items.stream().map(Item::getId).collect(Collectors.toList());
		List<ItemHistory> coinHistories =
				itemHistoryQueryService.getCoinHistoryOnItem(userId, start, end, itemIds);

		Map<Long, Item> itemMap = items.stream()
				.collect(Collectors.toMap(Item::getId, item -> item));
		List<CoinHistoryDto> result = coinHistories.stream()
				.map(ih -> itemMapper.toCoinHistoryDto(ih, itemMap.get(ih.getItemId())))
				.collect(Collectors.toList());
		return itemMapper.toCoinHistoryResponseDto(result);
	}
}
