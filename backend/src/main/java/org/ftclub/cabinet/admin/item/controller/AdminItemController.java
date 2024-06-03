package org.ftclub.cabinet.admin.item.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminItemHistoryPaginationDto;
import org.ftclub.cabinet.admin.item.service.AdminItemFacadeService;
import org.ftclub.cabinet.admin.statistics.service.AdminStatisticsFacadeService;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.ItemAssignRequestDto;
import org.ftclub.cabinet.dto.ItemCreateDto;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/v5/admin/items")
@RequiredArgsConstructor
@RestController
@Logging
public class AdminItemController {

	private final AdminItemFacadeService adminItemFacadeService;
	private final AdminStatisticsFacadeService adminStatisticsFacadeService;


	@PostMapping("")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void createItem(@RequestBody ItemCreateDto itemCreateDto) {
		adminItemFacadeService.createItem(itemCreateDto.getPrice(),
				itemCreateDto.getSku(), itemCreateDto.getType());
	}

	@PostMapping("/assign")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void assignItem(@RequestBody ItemAssignRequestDto itemAssignRequestDto) {
		adminItemFacadeService.assignItem(itemAssignRequestDto.getUserIds(),
				itemAssignRequestDto.getItemSku());
	}

	/**
	 * 특정 유저의 아이템 history 조회
	 *
	 * @param userId
	 * @param pageable
	 * @return
	 */
	@GetMapping("/users/{userId}")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public AdminItemHistoryPaginationDto getUserItemHistoryPagination(
			@PathVariable(value = "userId") Long userId, Pageable pageable) {
		return adminItemFacadeService.getUserItemHistories(userId, pageable);
	}
}
