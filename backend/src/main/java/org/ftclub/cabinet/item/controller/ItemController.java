package org.ftclub.cabinet.item.controller;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.CoinCollectionRewardResponseDto;
import org.ftclub.cabinet.dto.CoinHistoryPaginationDto;
import org.ftclub.cabinet.dto.CoinMonthlyCollectionDto;
import org.ftclub.cabinet.dto.ItemHistoryPaginationDto;
import org.ftclub.cabinet.dto.ItemStoreResponseDto;
import org.ftclub.cabinet.dto.ItemUseRequestDto;
import org.ftclub.cabinet.dto.MyItemResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.item.domain.CoinHistoryType;
import org.ftclub.cabinet.item.domain.Sku;
import org.ftclub.cabinet.item.service.ItemFacadeService;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.UserSession;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v5/items")
@Logging
public class ItemController {

	private final ItemFacadeService itemFacadeService;

	/**
	 * 전체 아이템 목록 조회
	 *
	 * @return
	 */
	@GetMapping("")
	@AuthGuard(level = AuthLevel.USER_OR_ADMIN)
	public ItemStoreResponseDto getAllItems() {
		return itemFacadeService.getAllItems();
	}

	/**
	 * 특정 아이템 구매 요청
	 *
	 * @param user
	 * @param sku
	 */
	@PostMapping("/{sku}/purchase")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void purchaseItem(@UserSession UserSessionDto user,
			@PathVariable Sku sku) {
		itemFacadeService.purchaseItem(user.getUserId(), sku);
	}

	/**
	 * 유저의 아이템 구매, 사용 내역 목록 조회
	 *
	 * @param user
	 * @param pageable
	 * @return
	 */
	@GetMapping("/history")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public ItemHistoryPaginationDto getItemHistory(@UserSession UserSessionDto user,
			Pageable pageable) {
		return itemFacadeService.getItemHistory(user.getUserId(), pageable);
	}

	/**
	 * 유저가 보유하고 있는 아이템 목록 조회
	 *
	 * @param user
	 * @return
	 */
	@GetMapping("/me")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public MyItemResponseDto getMyItems(@UserSession UserSessionDto user) {
		return itemFacadeService.getMyItems(user);
	}

	/**
	 * 유저의 동전 줍기 내역 반환
	 *
	 * @param user
	 * @param type     ALL, EARN, USE
	 * @param pageable
	 * @return
	 */
	@GetMapping("/coin/history")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public CoinHistoryPaginationDto getCoinHistory(@UserSession UserSessionDto user,
			@RequestParam CoinHistoryType type, Pageable pageable) {
		return itemFacadeService.getCoinHistory(user.getUserId(), type, pageable);
	}

	/**
	 * 한달 간 동전 줍기 횟수, 당일 동전줍기 요청 유무
	 *
	 * @param user 유저 세션
	 * @return
	 */
	@GetMapping("/coin")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public CoinMonthlyCollectionDto getCoinMonthlyCollectionCount(
			@UserSession UserSessionDto user) {
		return itemFacadeService.getCoinCollectionCountInMonth(user.getUserId());
	}

	/**
	 * 동전 줍기 요청
	 *
	 * @param user 유저 세션
	 */
	@PostMapping("/coin")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public CoinCollectionRewardResponseDto collectCoin(@UserSession UserSessionDto user) {
		return itemFacadeService.collectCoinAndIssueReward(user.getUserId());
	}

	/**
	 * 아이템 사용 요청
	 *
	 * @param user 유저 세션
	 * @param sku  아이템 고유 식별 값
	 * @param data sku 에 따라 다르게 필요한 정보
	 */
	@PostMapping("{sku}/use")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void useItem(@UserSession UserSessionDto user,
			@PathVariable("sku") Sku sku,
			@Valid @RequestBody ItemUseRequestDto data) {
		itemFacadeService.useItem(user.getUserId(), sku, data);
	}
}
