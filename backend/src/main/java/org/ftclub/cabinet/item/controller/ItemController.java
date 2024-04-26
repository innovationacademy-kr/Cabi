package org.ftclub.cabinet.item.controller;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.CoinHistoryResponseDto;
import org.ftclub.cabinet.dto.ItemHistoryResponseDto;
import org.ftclub.cabinet.dto.ItemStoreResponseDto;
import org.ftclub.cabinet.dto.MyItemResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.item.domain.CoinHistoryType;
import org.ftclub.cabinet.item.domain.Sku;
import org.ftclub.cabinet.item.service.ItemFacadeService;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.UserSession;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
	public ItemHistoryResponseDto getItemHistory(@UserSession UserSessionDto user,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
		return itemFacadeService.getItemHistory(user.getUserId(), start, end);
	}

	@GetMapping("/me")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public MyItemResponseDto getMyItems(@UserSession UserSessionDto user) {
		return itemFacadeService.getMyItems(user);
	}

	@GetMapping("/coin/history")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public CoinHistoryResponseDto getCoinHistory(@UserSession UserSessionDto user,
			@RequestParam CoinHistoryType type,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
		return itemFacadeService.getCoinHistory(user.getUserId(), type, start, end);
	}

//	/**
//	 * @param user
//	 * @param itemId
//	 */
//	@PostMapping("/{itemId}/user")
//	@AuthGuard(level = AuthLevel.USER_ONLY)
//	public void useItem(@UserSession UserSessionDto user, @PathVariable Long itemId) {
//		itemFacadeService.useItem(user.getUserId(), itemId);
//	}

//	@GetMapping("/coin")
//	@AuthGuard(level = AuthLevel.USER_ONLY)
//	public CoinInformationDto getCoinInformation(@UserSession UserSessionDto user, Long itemId) {
//		return itemFacadeService.getCoinInformation(user.getUserId(), itemId);
//	}
}