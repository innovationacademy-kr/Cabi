package org.ftclub.cabinet.item.service;

import static org.ftclub.cabinet.item.domain.CoinHistoryType.ALL;
import static org.ftclub.cabinet.item.domain.CoinHistoryType.EARN;
import static org.ftclub.cabinet.item.domain.CoinHistoryType.USE;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.CoinHistoryDto;
import org.ftclub.cabinet.dto.CoinHistoryResponseDto;
import org.ftclub.cabinet.dto.CoinInformationDto;
import org.ftclub.cabinet.dto.ItemDto;
import org.ftclub.cabinet.dto.ItemHistoryDto;
import org.ftclub.cabinet.dto.ItemHistoryResponseDto;
import org.ftclub.cabinet.dto.ItemResponseDto;
import org.ftclub.cabinet.dto.MyItemResponseDto;
import org.ftclub.cabinet.dto.UserBlackHoleEvent;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.item.domain.CoinHistoryType;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemHistory;
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
	private final ItemHistoryCommandService itemHistoryCommandService;
	private final ItemMapper itemMapper;
	private final UserQueryService userQueryService;
	private final ItemRedisService itemRedisService;
	private final ApplicationEventPublisher eventPublisher;

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
//		List<ItemHistory> userItemHistories = itemHistoryQueryService.findAllItemHistoryByUser(user.getUserId());
//
//		List<ItemDto> extensionItems = getItemDtos(userItemHistories);
//
//		List<ItemDto> exchangeItems = userItemHistories.stream()
//				.filter(ih -> ih.getItem())
//				.map(ih -> itemMapper.toItemDto(ih.getItem()))
//				.collect(Collectors.toList());
//
//		List<ItemDto> alarmItems = userItemHistories.stream()
//				.filter(ih -> ih.getItem().getSku().isAlarmType())
//				.map(ih -> itemMapper.toItemDto(ih.getItem()))
//				.collect(Collectors.toList());
//
//		List<ItemDto> penaltyItems = userItemHistories.stream()
//				.filter(ih -> ih.getItem().getSku().isPenaltyType())
//				.map(ih -> itemMapper.toItemDto(ih.getItem()))
//				.collect(Collectors.toList());
//
//		return itemMapper.toMyItemResponseDto(extensionItems, exchangeItems, alarmItems, penaltyItems);
		return null;
	}

//	private List<ItemDto> getItemDtos(List<ItemHistory> userItemHistories, ) {
//		List<ItemDto> extensionItems = userItemHistories.stream()
//				.filter(ih -> ih.getItem().getSku().isExtensionType())
//				.map(ih -> itemMapper.toItemDto(ih.getItem()))
//				.collect(Collectors.toList());
//		return extensionItems;
//	}


	@Transactional(readOnly = true)
	public ItemHistoryResponseDto getItemHistory(Long userId,
			LocalDateTime start, LocalDateTime end) {
		List<ItemHistory> itemHistories =
				itemHistoryQueryService.getItemHistory(userId, start, end);
		List<ItemHistoryDto> result = itemHistories.stream()
				.sorted((ih1, ih2) -> ih1.getUsedAt().compareTo(ih2.getUsedAt()))
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
				itemHistoryQueryService.getCoinHistoryOnItem(userId, start, end, itemIds);

		Map<Long, Item> itemMap = items.stream()
				.collect(Collectors.toMap(Item::getId, item -> item));
		List<CoinHistoryDto> result = coinHistories.stream()
				.sorted((ih1, ih2) -> ih1.getPurchaseAt().compareTo(ih2.getPurchaseAt()))
				.map(ih -> itemMapper.toCoinHistoryDto(ih, itemMap.get(ih.getItemId())))
				.collect(Collectors.toList());
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
		User user = userQueryService.getUser(userId);

		// 유저가 블랙홀인지 확인
		if (user.isBlackholed()) {
			eventPublisher.publishEvent(UserBlackHoleEvent.of(user));
		}

		Long itemPrice = itemQueryService.getItemById(itemId).getPrice();
		Long userCoin = itemRedisService.getCoinCount(userId);

		// 보유 코인 확인
		if (userCoin < itemPrice) {
			throw ExceptionStatus.NOT_ENOUGH_COIN.asServiceException();
		}

		// 아이템 구매 처리
		itemCommandService.purchaseItem(user.getId(), itemId);

		// 코인 차감
		itemRedisService.saveCoinCount(userId, userCoin - itemPrice);
	}
}
