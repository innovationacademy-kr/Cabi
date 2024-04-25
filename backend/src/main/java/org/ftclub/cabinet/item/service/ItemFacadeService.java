package org.ftclub.cabinet.item.service;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;

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
import org.ftclub.cabinet.dto.ItemDto;
import org.ftclub.cabinet.dto.ItemHistoryDto;
import org.ftclub.cabinet.dto.ItemHistoryResponseDto;
import org.ftclub.cabinet.dto.ItemStoreDto;
import org.ftclub.cabinet.dto.ItemStoreResponseDto;
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
	public ItemStoreResponseDto getAllItems() {
		List<Item> allItems = itemQueryService.getAllItems();
		Map<ItemType, List<ItemDto>> itemMap = allItems.stream()
				.filter(item -> item.getPrice() < 0)
				.collect(groupingBy(Item::getType,
						mapping(itemMapper::toItemDto, Collectors.toList())));
		List<ItemStoreDto> result = itemMap.entrySet().stream()
				.map(entry -> itemMapper.toItemStoreDto(entry.getKey().getName(),
						entry.getKey().getDescription(), entry.getValue()))
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
				.map(ih -> {
					Item item = itemMap.get(ih.getItemId());
					return itemMapper.toCoinHistoryDto(ih, item, item.getType().getDescription());
				}).collect(Collectors.toList());
		return new CoinHistoryResponseDto(result);
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
	 * @param itemId
	 */
	@Transactional
	public void purchaseItem(Long userId, Long itemId) {
		// 유저가 블랙홀인지 확인
		User user = userQueryService.getUser(userId);
		if (user.isBlackholed()) {
			eventPublisher.publishEvent(UserBlackHoleEvent.of(user));
		}

		Item item = itemQueryService.getItemById(itemId);
		long price = item.getPrice();
		long userCoin = itemRedisService.getCoinCount(userId);

		// 아이템 Policy 검증
		itemPolicyService.verifyOnSale(price);
		itemPolicyService.verifyIsAffordable(userCoin, price);

		// 아이템 구매 처리
		itemCommandService.purchaseItem(user.getId(), itemId);

		// 코인 차감
		itemRedisService.saveCoinCount(userId, userCoin - price);
	}
}
