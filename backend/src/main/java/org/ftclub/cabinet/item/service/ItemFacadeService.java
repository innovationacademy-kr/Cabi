package org.ftclub.cabinet.item.service;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.CoinHistoryDto;
import org.ftclub.cabinet.dto.CoinHistoryPaginationDto;
import org.ftclub.cabinet.dto.CoinMonthlyCollectionDto;
import org.ftclub.cabinet.dto.ItemDetailsDto;
import org.ftclub.cabinet.dto.ItemDto;
import org.ftclub.cabinet.dto.ItemHistoryDto;
import org.ftclub.cabinet.dto.ItemHistoryPaginationDto;
import org.ftclub.cabinet.dto.ItemStoreDto;
import org.ftclub.cabinet.dto.ItemStoreResponseDto;
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
import org.ftclub.cabinet.item.domain.PenaltyItem;
import org.ftclub.cabinet.item.domain.Sku;
import org.ftclub.cabinet.item.domain.SwapItem;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.ItemMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ItemFacadeService {

	private final ItemQueryService itemQueryService;
	private final ItemHistoryQueryService itemHistoryQueryService;
	private final ItemHistoryCommandService itemHistoryCommandService;
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
	public ItemStoreResponseDto getAllItems() {
		List<Item> allItems = itemQueryService.getAllItems();
		Map<ItemType, List<ItemDetailsDto>> itemMap = allItems.stream()
			.filter(item -> item.getPrice() < 0)
			.collect(groupingBy(Item::getType,
				mapping(itemMapper::toItemDetailsDto, Collectors.toList())));
		List<ItemStoreDto> result = itemMap.entrySet().stream()
			.map(entry -> itemMapper.toItemStoreDto(entry.getKey(), entry.getValue()))
			.collect(Collectors.toList());
		return new ItemStoreResponseDto(result);
	}

	@Transactional(readOnly = true)
	public MyItemResponseDto getMyItems(UserSessionDto user) {
		List<ItemHistory> userItemHistories = itemHistoryQueryService.findAllItemHistoryByUser(
			user.getUserId());

		Map<ItemType, List<ItemDto>> itemMap = userItemHistories.stream()
			.map(ItemHistory::getItem)
			.filter(item -> item.getPrice() < 0)
			.collect(groupingBy(Item::getType,
				mapping(itemMapper::toItemDto, Collectors.toList())));

		List<ItemDto> extensionItems = itemMap.getOrDefault(ItemType.EXTENSION,
			Collections.emptyList());
		List<ItemDto> swapItems = itemMap.getOrDefault(ItemType.SWAP, Collections.emptyList());
		List<ItemDto> alarmItems = itemMap.getOrDefault(ItemType.ALARM, Collections.emptyList());
		List<ItemDto> penaltyItems = itemMap.getOrDefault(ItemType.PENALTY,
			Collections.emptyList());

		return itemMapper.toMyItemResponseDto(extensionItems, swapItems, alarmItems, penaltyItems);
	}


	@Transactional(readOnly = true)
	public ItemHistoryPaginationDto getItemHistory(Long userId, Pageable pageable) {
		Page<ItemHistory> itemHistories =
			itemHistoryQueryService.getItemHistoryWithItem(userId, pageable);
		List<ItemHistoryDto> result = itemHistories.stream()
			.map(ih -> itemMapper.toItemHistoryDto(ih, itemMapper.toItemDto(ih.getItem())))
			.collect(Collectors.toList());
		return itemMapper.toItemHistoryPaginationDto(result, itemHistories.getTotalElements());
	}

	@Transactional(readOnly = true)
	public CoinHistoryPaginationDto getCoinHistory(Long userId, CoinHistoryType type,
		Pageable pageable) {

		Set<Item> items = new HashSet<>();
		if (type.equals(CoinHistoryType.EARN) || type.equals(CoinHistoryType.ALL)) {
			items.addAll(itemQueryService.getEarnItemIds());
		}
		if (type.equals(CoinHistoryType.USE) || type.equals(CoinHistoryType.ALL)) {
			items.addAll(itemQueryService.getUseItemIds());
		}
		List<Long> itemIds = items.stream().map(Item::getId).collect(Collectors.toList());
		Page<ItemHistory> coinHistories =
			itemHistoryQueryService.getCoinHistory(userId, pageable, itemIds);

		Map<Long, Item> itemMap = items.stream()
			.collect(Collectors.toMap(Item::getId, item -> item));
		List<CoinHistoryDto> result = coinHistories.stream()
			.map(ih -> itemMapper.toCoinHistoryDto(ih, itemMap.get(ih.getItemId())))
			.collect(Collectors.toList());
		return itemMapper.toCoinHistoryPaginationDto(result, coinHistories.getTotalElements());
	}

	/**
	 * itemRedisService 를 통해 동전 줍기 정보 생성
	 *
	 * @param userId redis 의 고유 key 를 만들 userId
	 * @return
	 */
	@Transactional(readOnly = true)
	public CoinMonthlyCollectionDto getCoinCollectionCountInMonth(Long userId) {
		Long coinCollectionCountInMonth =
			itemRedisService.getCoinCollectionCountInMonth(userId);
		boolean isCollectedInToday = itemRedisService.isCoinCollected(userId);

		return itemMapper.toCoinMonthlyCollectionDto(coinCollectionCountInMonth,
			isCollectedInToday);
	}

	/**
	 * 당일 중복해서 동전줍기를 요청했는지 검수 후
	 * <p>
	 * 당일 동전 줍기 체크 및 한 달 동전줍기 횟수 증가
	 *
	 * @param userId redis 의 고유 key 를 만들 userId
	 */
	@Transactional(readOnly = true)
	public void collectCoin(Long userId) {
		boolean isChecked = itemRedisService.isCoinCollected(userId);
		itemPolicyService.verifyIsAlreadyCollectedCoin(isChecked);
		itemRedisService.collectCoin(userId);
	}

	/**
	 * @param userId
	 * @param sku
	 * @param data
	 */
	@Transactional
	public void useItem(Long userId, Sku sku, ItemUseRequestDto data) {
		itemPolicyService.verifyDataFieldBySky(sku, data);
		User user = userQueryService.getUser(userId);
		if (user.isBlackholed()) {
			eventPublisher.publishEvent(UserBlackHoleEvent.of(user));
		}
		Item item = itemQueryService.getBySku(sku);
		List<ItemHistory> itemInInventory =
			itemHistoryQueryService.getItemsByItemIdInUserInventory(user.getId(), item.getId());
		ItemHistory firstItem = itemPolicyService.verifyEmptyItems(itemInInventory);
		ItemUsage itemUsage = getItemUsage(userId, item, data);

		eventPublisher.publishEvent(itemUsage);
		firstItem.updateUsedAt();
	}

	/**
	 * itemType 에 따른 구현체 반환
	 *
	 * @param userId
	 * @param item
	 * @param data
	 * @return
	 */
	private ItemUsage getItemUsage(Long userId, Item item, ItemUseRequestDto data) {
		// 연장권, 이사권, 패널티
		if (item.getType().equals(ItemType.SWAP)) {
			return new SwapItem(userId, data.getNewCabinetId());
		}
		if (item.getType().equals(ItemType.EXTENSION)) {
			return new ExtensionItem(userId, item.getSku().getDays());
		}
		if (item.getType().equals(ItemType.PENALTY)) {
			return new PenaltyItem(userId, item.getSku().getDays());
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
	 * @param sku
	 */
	@Transactional
	public void purchaseItem(Long userId, Sku sku) {
		// 유저가 블랙홀인지 확인
		User user = userQueryService.getUser(userId);
		if (user.isBlackholed()) {
			eventPublisher.publishEvent(UserBlackHoleEvent.of(user));
		}

		Item item = itemQueryService.getItemBySku(sku);
		long price = item.getPrice();
		long userCoin = itemRedisService.getCoinCount(userId);

		// 아이템 Policy 검증
		itemPolicyService.verifyOnSale(price);
		itemPolicyService.verifyIsAffordable(userCoin, price);

		// 아이템 구매 처리
		itemHistoryCommandService.purchaseItem(user.getId(), item.getId());

		// 코인 차감
		itemRedisService.saveCoinCount(userId, userCoin + price);
	}
}
