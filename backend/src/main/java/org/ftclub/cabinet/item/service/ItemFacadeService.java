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
import org.ftclub.cabinet.dto.CoinInformationDto;
import org.ftclub.cabinet.dto.ItemDto;
import org.ftclub.cabinet.dto.ItemHistoryResponseDto;
import org.ftclub.cabinet.dto.ItemResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.dto.*;
import org.ftclub.cabinet.item.domain.CoinHistoryType;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.ItemMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemFacadeService {

    private final ItemQueryService itemQueryService;
    private final ItemCommandService itemCommandService;
    private final ItemHistoryQueryService itemHistoryQueryService;
    private final ItemHistoryCommandService itemHistoryCommandService;
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
	@Transactional
	public ItemResponseDto getAllItems() {
		List<Item> allItems = itemQueryService.getAllItems();
		List<ItemDto> itemDtos = allItems.stream()
				.map(itemMapper::toItemDto)
				.collect(Collectors.toList());
		return new ItemResponseDto(itemDtos);
	}

    @Transactional(readOnly = true)
    public MyItemResponseDto getMyItems(UserSessionDto user) {
        itemHistoryQueryService.getItemHistory(user.getUserId(), LocalDateTime.now(), LocalDateTime.now());
        return null;
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
	@Transactional(readOnly = true)
	public CoinHistoryResponseDto getCoinHistory(Long userId, CoinHistoryType type,
		LocalDateTime start, LocalDateTime end) {
		List<Item> items = new ArrayList<>();
		if (type.equals(CoinHistoryType.EARN) || type.equals(CoinHistoryType.ALL)) {
			items.addAll(itemQueryService.getEarnItemIds());
		}
		if (type.equals(CoinHistoryType.USE) || type.equals(CoinHistoryType.ALL)) {
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

//	/**
//	 * 유저가 보유한 point와 비교한 후 아이템을 사용합니다.
//	 *
//	 * @param userId
//	 * @param itemId
//	 */
//	@Transactional
//	public void useItem(Long userId, Long itemId) {
//		Item item = itemQueryService.getById(itemId);
//		Long price = item.getPrice();
//
//		Long userPoint = itemHistoryQueryService.getUserPoint(userId);
//		if (price > userPoint) {
//
//		}
//	}

	/**
	 * 해당 월의 총 Coin 아이템을 획득한 횟수, 요청일의 출석체크 해당 여부를 반환
	 *
	 * @param userId
	 * @param itemId
	 * @return
	 */
	public CoinInformationDto getCoinInformation(Long userId, Long itemId) {
		LocalDateTime now = LocalDateTime.now();
		itemHistoryQueryService.get
	}
}
