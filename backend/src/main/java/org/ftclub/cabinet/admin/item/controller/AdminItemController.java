package org.ftclub.cabinet.admin.item.controller;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminItemHistoryPaginationDto;
import org.ftclub.cabinet.admin.item.service.AdminItemFacadeService;
import org.ftclub.cabinet.dto.ItemAssignRequestDto;
import org.ftclub.cabinet.dto.ItemCreateDto;
import org.ftclub.cabinet.dto.ItemDetailsDto;
import org.ftclub.cabinet.dto.ItemStoreDto;
import org.ftclub.cabinet.dto.ItemStoreResponseDto;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemType;
import org.ftclub.cabinet.item.service.ItemQueryService;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.ItemMapper;
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
	private final ItemQueryService itemQueryService;
	private final ItemMapper itemMapper;

	@PostMapping("")
	public void createItem(@RequestBody ItemCreateDto itemCreateDto) {
		adminItemFacadeService.createItem(itemCreateDto.getPrice(),
				itemCreateDto.getSku(), itemCreateDto.getType());
	}

	@GetMapping("")
	public ItemStoreResponseDto getAllItems() {
		List<Item> allItems = itemQueryService.getAllItems();
		Map<ItemType, List<ItemDetailsDto>> itemMap = allItems.stream()
				.collect(groupingBy(Item::getType,
						mapping(itemMapper::toItemDetailsDto, Collectors.toList())));
		List<ItemStoreDto> result = itemMap.entrySet().stream()
				.map(entry -> {
					ItemStoreDto itemStoreDto = itemMapper.toItemStoreDto(entry.getKey(),
							entry.getValue());
					itemStoreDto.sortBySkuASC();
					return itemStoreDto;
				})
				.collect(Collectors.toList());
		return new ItemStoreResponseDto(result);
	}

	@PostMapping("/assign")
	public void assignItem(@RequestBody ItemAssignRequestDto itemAssignRequestDto) {
		adminItemFacadeService.assignItem(itemAssignRequestDto.getUserIds(),
				itemAssignRequestDto.getItemSku(), itemAssignRequestDto.getAmount());
	}

	/**
	 * 특정 유저의 아이템 history 조회
	 *
	 * @param userId
	 * @param pageable
	 * @return
	 */
	@GetMapping("/users/{userId}")
	public AdminItemHistoryPaginationDto getUserItemHistoryPagination(
			@PathVariable(value = "userId") Long userId, Pageable pageable) {
		return adminItemFacadeService.getUserItemHistories(userId, pageable);
	}
}
