package org.ftclub.cabinet.item.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.CoinHistoryDto;
import org.ftclub.cabinet.dto.CoinHistoryResponseDto;
import org.ftclub.cabinet.dto.CoinMonthlyCollectionDto;
import org.ftclub.cabinet.dto.ItemDto;
import org.ftclub.cabinet.dto.ItemHistoryDto;
import org.ftclub.cabinet.dto.ItemHistoryResponseDto;
import org.ftclub.cabinet.dto.ItemResponseDto;
import org.ftclub.cabinet.dto.MyItemResponseDto;
import org.ftclub.cabinet.dto.UserBlackHoleEvent;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.item.domain.CoinHistoryType;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.item.domain.ItemType;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.ItemMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemFacadeService {

	private final ItemQueryService itemQueryService;
	private final ItemCommandService itemCommandService;
	private final ItemHistoryQueryService itemHistoryQueryService;
	private final ItemMapper itemMapper;
	private final UserQueryService userQueryService;
	private final ItemRedisService itemRedisService;
	private final ApplicationEventPublisher eventPublisher;
	private final ItemPolicyService itemPolicyService;

	/**
	 * 모든 아이템 리스트 반환
	 *
	 * @return 전체 아이템 리스트
	 */
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
		List<ItemHistory> userItemHistories = itemHistoryQueryService.findAllItemHistoryByUser(
			user.getUserId());

		Map<ItemType, List<ItemDto>> itemMap = userItemHistories.stream()
			.map(ItemHistory::getItem)
			.collect(Collectors.groupingBy(Item::getType,
				Collectors.mapping(itemMapper::toItemDto, Collectors.toList())));

		List<ItemDto> extensionItems = itemMap.getOrDefault(ItemType.EXTENSION,
			Collections.emptyList());
		List<ItemDto> swapItems = itemMap.getOrDefault(ItemType.SWAP, Collections.emptyList());
		List<ItemDto> alarmItems = itemMap.getOrDefault(ItemType.ALARM, Collections.emptyList());
		List<ItemDto> penaltyItems = itemMap.getOrDefault(ItemType.PENALTY,
			Collections.emptyList());

		return itemMapper.toMyItemResponseDto(extensionItems, swapItems, alarmItems, penaltyItems);
	}


	@Transactional(readOnly = true)
	public ItemHistoryResponseDto getItemHistory(Long userId,
		LocalDateTime start, LocalDateTime end) {
		List<ItemHistory> itemHistories =
			itemHistoryQueryService.getItemHistoryWithItem(userId, start, end);
		List<ItemHistoryDto> result = itemHistories.stream()
			.sorted(Comparator.comparing(ItemHistory::getUsedAt))
			.filter(ih -> ih.getItem().getPrice() < 0)
			.map(ih -> itemMapper.toItemHistoryDto(ih, itemMapper.toItemDto(ih.getItem())))
			.collect(Collectors.toList());
		return new ItemHistoryResponseDto(result);
	}

	@Transactional(readOnly = true)
	public CoinHistoryResponseDto getCoinHistory(Long userId, CoinHistoryType type,
		LocalDateTime start, LocalDateTime end) {

		Set<Item> items = new HashSet<>();
		if (type.equals(CoinHistoryType.EARN) || type.equals(CoinHistoryType.ALL)) {
			items.addAll(itemQueryService.getEarnItemIds());
		}
		if (type.equals(CoinHistoryType.USE) || type.equals(CoinHistoryType.ALL)) {
			items.addAll(itemQueryService.getUseItemIds());
		}
		List<Long> itemIds = items.stream().map(Item::getId).collect(Collectors.toList());
		List<ItemHistory> coinHistories =
			itemHistoryQueryService.getCoinHistoryOnItems(userId, start, end, itemIds);

		Map<Long, Item> itemMap = items.stream()
			.collect(Collectors.toMap(Item::getId, item -> item));
		List<CoinHistoryDto> result = coinHistories.stream()
			.sorted(Comparator.comparing(ItemHistory::getPurchaseAt))
			.map(ih -> itemMapper.toCoinHistoryDto(ih, itemMap.get(ih.getItemId())))
			.collect(Collectors.toList());
		return new CoinHistoryResponseDto(result);
	}

	/**
	 * @param userId
	 * @param itemId
	 * @return
	 */
	public CoinMonthlyCollectionDto getCoinMonthlyCollectionCount(Long userId, Long itemId) {
		LocalDate today = LocalDate.now();
		LocalDateTime start = today.withDayOfMonth(1).atStartOfDay();
		LocalDateTime end = YearMonth.from(today).atEndOfMonth().atTime(23, 59);

		Long coinCollectionCount =
			itemHistoryQueryService.getCountByUserIdAndItemIdBetween(userId, itemId, start, end);
		boolean todayCheck = itemRedisService.isCoinCollectable(userId);

		return itemMapper.toCoinMonthlyCollectionDto(coinCollectionCount, todayCheck);
	}

	/**
	 * user가 아이템 구매 요청
	 *
	 * @param userId
	 * @param itemId
	 */
	@Transactional
	public void purchaseItem(Long userId, Long itemId) {
		User user = userQueryService.getUser(userId);

		// 유저가 블랙홀인지 확인
		if (user.isBlackholed()) {
			eventPublisher.publishEvent(UserBlackHoleEvent.of(user));
		}
		Item item = itemQueryService.getItemById(itemId);
		Long userCoin = itemRedisService.getCoinCount(userId);

		itemPolicyService.verifyIsAffordable(userCoin, item.getPrice());

		// 아이템 구매 처리
		itemCommandService.purchaseItem(user.getId(), itemId);

		// 코인 차감
		itemRedisService.saveCoinCount(userId, userCoin - item.getPrice());
	}
}
