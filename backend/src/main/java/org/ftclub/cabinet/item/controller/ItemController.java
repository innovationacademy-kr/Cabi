package org.ftclub.cabinet.item.controller;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.security.UserInfoDto;
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
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
	public void purchaseItem(@AuthenticationPrincipal UserInfoDto user,
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
	public ItemHistoryPaginationDto getItemHistory(@AuthenticationPrincipal UserSessionDto user,
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
	public MyItemResponseDto getMyItems(@AuthenticationPrincipal UserInfoDto user) {
		return itemFacadeService.getMyItems(user.getUserId());
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
	public CoinHistoryPaginationDto getCoinHistory(@AuthenticationPrincipal UserInfoDto user,
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
	public CoinMonthlyCollectionDto getCoinMonthlyCollectionCount(
			@AuthenticationPrincipal UserInfoDto user) {
		return itemFacadeService.getCoinCollectionCountInMonth(user.getUserId());
	}

	/**
	 * 동전 줍기 요청
	 *
	 * @param user 유저 세션
	 */
	@PostMapping("/coin")
	public CoinCollectionRewardResponseDto collectCoin(@AuthenticationPrincipal UserInfoDto user) {
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
	public void useItem(@AuthenticationPrincipal UserInfoDto user,
			@PathVariable("sku") Sku sku,
			@Valid @RequestBody ItemUseRequestDto data) {
		itemFacadeService.useItem(user.getUserId(), sku, data);
	}
}
