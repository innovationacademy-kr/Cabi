package org.ftclub.cabinet.admin.item.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.ItemAssignDto;
import org.ftclub.cabinet.dto.ItemCreateDto;
import org.ftclub.cabinet.item.service.ItemCommandService;
import org.ftclub.cabinet.log.Logging;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/v5/admin/items")
@RequiredArgsConstructor
@RestController
@Logging
public class AdminItemController {

	private final ItemCommandService itemCommandService;

	@PostMapping("")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void createItem(@RequestBody ItemCreateDto itemCreateDto) {
		itemCommandService.createItem(itemCreateDto);
	}

	@PostMapping("/assign")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void assignItem(@RequestBody ItemAssignDto itemAssignDto) {
		itemCommandService.assignItem(itemAssignDto);
	}
}
