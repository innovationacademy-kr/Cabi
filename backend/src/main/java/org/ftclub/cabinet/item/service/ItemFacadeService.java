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
import org.ftclub.cabinet.dto.ItemDto;
import org.ftclub.cabinet.dto.ItemHistoryDto;
import org.ftclub.cabinet.dto.ItemHistoryPaginationDto;
import org.ftclub.cabinet.dto.ItemStoreDto;
import org.ftclub.cabinet.dto.ItemStoreResponseDto;
import org.ftclub.cabinet.dto.MyItemResponseDto;
import org.ftclub.cabinet.dto.UserBlackHoleEvent;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.item.domain.CoinHistoryType;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.item.domain.ItemType;
import org.ftclub.cabinet.item.domain.Sku;
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
	private final ItemCommandService itemCommandService;
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
		Map<ItemType, List<ItemDto>> itemMap = allItems.stream()
				.filter(item -> item.getPrice() < 0)
				.collect(groupingBy(Item::getType,
						mapping(itemMapper::toItemDto, Collectors.toList())));
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
//	public CoinInformationDto getCoinInformation(Long userId, Long itemId) {
//		LocalDateTime now = LocalDateTime.now();
//		itemHistoryQueryService.get
//	}

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
