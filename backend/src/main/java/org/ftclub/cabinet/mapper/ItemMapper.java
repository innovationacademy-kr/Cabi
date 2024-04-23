package org.ftclub.cabinet.mapper;

import static org.mapstruct.NullValueMappingStrategy.RETURN_DEFAULT;

import java.util.List;
import org.ftclub.cabinet.dto.CoinHistoryDto;
import org.ftclub.cabinet.dto.CoinHistoryResponseDto;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring",
		nullValueMappingStrategy = RETURN_DEFAULT,
		nullValueMapMappingStrategy = RETURN_DEFAULT,
		nullValueIterableMappingStrategy = RETURN_DEFAULT)
@Component
public interface ItemMapper {

	@Mapping(target = "date", source = "itemHistory.usedAt")
	@Mapping(target = "amount", source = "item.price")
	@Mapping(target = "history", source = "item.description")
	CoinHistoryDto toCoinHistoryDto(ItemHistory itemHistory, Item item);

	CoinHistoryResponseDto toCoinHistoryResponseDto(List<CoinHistoryDto> coinHistories);
}
