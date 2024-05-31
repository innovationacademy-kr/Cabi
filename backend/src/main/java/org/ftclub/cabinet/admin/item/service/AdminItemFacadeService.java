package org.ftclub.cabinet.admin.item.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminItemHistoryDto;
import org.ftclub.cabinet.admin.dto.AdminItemHistoryPaginationDto;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.item.domain.ItemType;
import org.ftclub.cabinet.item.domain.Sku;
import org.ftclub.cabinet.item.service.ItemCommandService;
import org.ftclub.cabinet.item.service.ItemHistoryCommandService;
import org.ftclub.cabinet.item.service.ItemHistoryQueryService;
import org.ftclub.cabinet.item.service.ItemQueryService;
import org.ftclub.cabinet.mapper.ItemMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminItemFacadeService {

	private final ItemQueryService itemQueryService;
	private final ItemCommandService itemCommandService;
	private final ItemHistoryCommandService itemHistoryCommandService;
	private final ItemHistoryQueryService itemHistoryQueryService;
	private final ItemMapper itemMapper;

	@Transactional
	public void createItem(Integer Price, Sku sku, ItemType type) {
		itemCommandService.createItem(Price, sku, type);
	}

	@Transactional
	public void assignItem(List<Long> userIds, Sku sku) {
		Item item = itemQueryService.getBySku(sku);
		LocalDateTime now = null;
		if (item.getPrice() > 0) {
			now = LocalDateTime.now();
		}
		itemHistoryCommandService.purchaseItem(userIds, item.getId(), now);
	}

	public AdminItemHistoryPaginationDto getUserItemHistories(Long userId, Pageable pageable) {
		Page<ItemHistory> itemHistoryWithItem =
				itemHistoryQueryService.getItemHistoriesByUserIdWithItem(userId, pageable);

		List<AdminItemHistoryDto> result = itemHistoryWithItem.stream()
				.map(ih -> itemMapper.toAdminItemHistoryDto(ih, ih.getItem()))
				.collect(Collectors.toList());

		return new AdminItemHistoryPaginationDto(result, itemHistoryWithItem.getTotalElements());
	}

}
