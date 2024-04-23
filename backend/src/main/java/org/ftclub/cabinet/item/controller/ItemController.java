package org.ftclub.cabinet.item.controller;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.ItemHistoryResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.item.service.ItemFacadeService;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.UserSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v5/items")
@Logging
public class ItemController {

	private final ItemFacadeService itemFacadeService;

	@GetMapping("/")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void getItems() {

	}

	@GetMapping("/history")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public ItemHistoryResponseDto getItemHistory(@UserSession UserSessionDto user,
			@RequestParam LocalDateTime start, @RequestParam LocalDateTime end) {
		return itemFacadeService.getItemHistory(user.getUserId(), start, end);
	}
}
