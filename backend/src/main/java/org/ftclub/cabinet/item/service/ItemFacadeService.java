package org.ftclub.cabinet.item.service;

import java.time.LocalDateTime;
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
import org.ftclub.cabinet.dto.ItemUseRequestDto;
import org.ftclub.cabinet.dto.MyItemResponseDto;
import org.ftclub.cabinet.dto.UserBlackHoleEvent;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.item.domain.AlarmItem;
import org.ftclub.cabinet.item.domain.CoinHistoryType;
import org.ftclub.cabinet.item.domain.ExtensionItem;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.item.domain.ItemType;
import org.ftclub.cabinet.item.domain.ItemUsage;
import org.ftclub.cabinet.item.domain.Sku;
import org.ftclub.cabinet.item.domain.SwapItem;
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
	 * 한 달 동안 수행한 동전 줍기 횟수와 오늘 동전줍기를 수행 여부를 반환합니다
	 *
	 * @param userId
	 * @param itemId
	 * @return
	 */
	public CoinMonthlyCollectionDto getCoinCollectionCountInMonth(Long userId) {
		Long coinCollectionCountInMonth =
			itemRedisService.getCoinCollectionCountInMonth(userId);
		boolean isCollectedInToday = itemRedisService.isCoinCollected(userId);

		return itemMapper.toCoinMonthlyCollectionDto(coinCollectionCountInMonth,
			isCollectedInToday);
	}

	public void collectCoin(Long userId) {
		itemPolicyService.verifyIsAlreadyCollectedCoin(userId);
		itemRedisService.collectCoin(userId);
	}

	/**
	 * 아이템 사용 기능
	 *
	 * @param userId
	 * @param itemId
	 */
	@Transactional
	public void useItem(Long userId, Sku sku, ItemUseRequestDto data) {
		User user = userQueryService.getUser(userId);
		if (user.isBlackholed()) {
			eventPublisher.publishEvent(UserBlackHoleEvent.of(user));
		}
		Item item = itemQueryService.getBySku(sku);
		List<ItemHistory> itemInInventory =
			itemHistoryQueryService.getItemsByItemIdInUserInventory(user.getId(), item.getId());
		ItemHistory firstItem = itemPolicyService.verifyEmptyItems(itemInInventory);

		ItemUsage itemUsage = getItemUsage(userId, item, data);
		// 공통 로직
		eventPublisher.publishEvent(itemUsage);
		firstItem.updateUsedAt();
	}

	private ItemUsage getItemUsage(Long userId, Item item, ItemUseRequestDto data) {
		// 연장권, 이사권, 패널티
		if (item.getType().equals(ItemType.SWAP)) {
			return new SwapItem(userId, data.getNewCabinetId());
		}
		if (item.getType().equals(ItemType.EXTENSION)) {
			return new ExtensionItem(userId, item.getSku().getDays());
		}
		if (item.getType().equals(ItemType.PENALTY)) {
			return new ExtensionItem(userId, item.getSku().getDays());
		}
		if (item.getType().equals(ItemType.ALARM)) {
			return new AlarmItem(userId, data.getSection());
		}
		throw ExceptionStatus.NOT_FOUND_ITEM.asServiceException();
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
