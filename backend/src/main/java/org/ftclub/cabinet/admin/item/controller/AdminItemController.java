package org.ftclub.cabinet.admin.item.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.ItemCreateDto;
import org.ftclub.cabinet.item.service.ItemCommandService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/v5/admin/items")
@RequiredArgsConstructor
public class AdminItemController {

	private final ItemCommandService itemCommandService;

	@PostMapping("")
	public void createItem(ItemCreateDto itemCreateDto) {
		itemCommandService.createItem(itemCreateDto);
	}


}
