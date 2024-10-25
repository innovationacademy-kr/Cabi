package org.ftclub.cabinet.mapper;

import static org.mapstruct.NullValueMappingStrategy.RETURN_DEFAULT;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.ftclub.cabinet.admin.dto.AdminItemHistoryDto;
import org.ftclub.cabinet.dto.CoinAmountDto;
import org.ftclub.cabinet.dto.CoinHistoryDto;
import org.ftclub.cabinet.dto.CoinHistoryPaginationDto;
import org.ftclub.cabinet.dto.CoinMonthlyCollectionDto;
import org.ftclub.cabinet.dto.ItemAssignResponseDto;
import org.ftclub.cabinet.dto.ItemDetailsDto;
import org.ftclub.cabinet.dto.ItemDto;
import org.ftclub.cabinet.dto.ItemHistoryDto;
import org.ftclub.cabinet.dto.ItemHistoryPaginationDto;
import org.ftclub.cabinet.dto.ItemPurchaseCountDto;
import org.ftclub.cabinet.dto.ItemStoreDto;
import org.ftclub.cabinet.dto.MyItemResponseDto;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.item.domain.ItemType;
import org.ftclub.cabinet.item.domain.Sku;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring",
		nullValueMappingStrategy = RETURN_DEFAULT,
		nullValueMapMappingStrategy = RETURN_DEFAULT,
		nullValueIterableMappingStrategy = RETURN_DEFAULT)
@Component
public interface ItemMapper {

	ItemMapper INSTANCE = Mappers.getMapper(ItemMapper.class);

	@Mapping(target = "date", source = "itemHistory.purchaseAt")
	@Mapping(target = "amount", source = "item.price")
	@Mapping(target = "history", source = "item.type.name")
	@Mapping(target = "itemDetails", source = "item.sku.details")
	@Mapping(target = "amount", source = "itemHistory.amount")
	CoinHistoryDto toCoinHistoryDto(ItemHistory itemHistory, Item item);

	@Mapping(target = "itemSku", source = "item.sku")
	@Mapping(target = "itemName", source = "item.type.name")
	@Mapping(target = "itemType", source = "item.type")
	@Mapping(target = "itemPrice", source = "item.price")
	@Mapping(target = "itemDetails", source = "item.sku.details")
	ItemDto toItemDto(Item item);

	@Mapping(target = "itemName", source = "item.type.name")
	@Mapping(target = "itemDetails", source = "item.sku.details")
	AdminItemHistoryDto toAdminItemHistoryDto(ItemHistory itemHistory, Item item);

	@Mapping(target = "itemSku", source = "item.sku")
	@Mapping(target = "itemPrice", source = "item.price")
	@Mapping(target = "itemDetails", source = "item.sku.details")
	ItemDetailsDto toItemDetailsDto(Item item);

	@Mapping(target = "date", source = "itemHistory.usedAt")
	ItemHistoryDto toItemHistoryDto(ItemHistory itemHistory, ItemDto itemDto);


	MyItemResponseDto toMyItemResponseDto(List<ItemDto> extensionItems, List<ItemDto> swapItems,
			List<ItemDto> alarmItems, List<ItemDto> penaltyItems);

	@Mapping(target = "itemName", source = "itemType.name")
	@Mapping(target = "itemType", source = "itemType")
	@Mapping(target = "description", source = "itemType.description")
	ItemStoreDto toItemStoreDto(ItemType itemType, List<ItemDetailsDto> items);

	ItemHistoryPaginationDto toItemHistoryPaginationDto(List<ItemHistoryDto> result,
			Long totalLength);

	CoinHistoryPaginationDto toCoinHistoryPaginationDto(List<CoinHistoryDto> result,
			Long totalLength);

	CoinMonthlyCollectionDto toCoinMonthlyCollectionDto(Long monthlyCoinCount,
			boolean todayCoinCollection);

	@Mapping(target = "itemSku", source = "sku")
	@Mapping(target = "itemDetails", source = "sku.details")
	@Mapping(target = "itemName", source = "itemType.name")
	ItemAssignResponseDto toItemAssignResponseDto(Sku sku, ItemType itemType,
			LocalDateTime issuedDate);

	@Mapping(target = "itemName", source = "item.type.name")
	@Mapping(target = "itemDetails", source = "item.sku.details")
	ItemPurchaseCountDto toItemPurchaseCountDto(Item item, int userCount);

	CoinAmountDto toCoinAmountDto(LocalDate date, Long amount);
}
