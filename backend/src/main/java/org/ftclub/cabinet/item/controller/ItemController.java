package org.ftclub.cabinet.item.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.CoinHistoryPaginationDto;
import org.ftclub.cabinet.dto.ItemHistoryPaginationDto;
import org.ftclub.cabinet.dto.ItemStoreResponseDto;
import org.ftclub.cabinet.dto.CoinMonthlyCollectionDto;
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

	@GetMapping("")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public ItemStoreResponseDto getAllItems() {
		return itemFacadeService.getAllItems();
	}

	@PostMapping("/{sku}/purchase")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void purchaseItem(@UserSession UserSessionDto user,
			@PathVariable Sku sku) {
		itemFacadeService.purchaseItem(user.getUserId(), sku);
	}

	@GetMapping("/history")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public ItemHistoryPaginationDto getItemHistory(@UserSession UserSessionDto user,
			Pageable pageable) {
		return itemFacadeService.getItemHistory(user.getUserId(), pageable);
	}

	@GetMapping("/me")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public MyItemResponseDto getMyItems(@UserSession UserSessionDto user) {
		return itemFacadeService.getMyItems(user);
	}

	@GetMapping("/coin/history")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public CoinHistoryPaginationDto getCoinHistory(@UserSession UserSessionDto user,
			@RequestParam CoinHistoryType type, Pageable pageable) {
		return itemFacadeService.getCoinHistory(user.getUserId(), type, pageable);
	}

	/**
	 * @param user
	 * @param itemId
	 * @return
	 */
	@GetMapping("/coin")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public CoinMonthlyCollectionDto getCoinMonthlyCollectionCount(
		@UserSession UserSessionDto user) {
		return itemFacadeService.getCoinCollectionCountInMonth(user.getUserId());
	}

	@PostMapping("/coin")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void collectCoin(@UserSession UserSessionDto user) {
		itemFacadeService.collectCoin(user.getUserId());
	}

	@PostMapping("{sku}/use")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void useItem(@UserSession UserSessionDto user,
		@PathVariable("sku") Sku sku,
		@RequestBody ItemUseRequestDto data) {
		itemFacadeService.useItem(user.getUserId(), sku, data);
	}
}
