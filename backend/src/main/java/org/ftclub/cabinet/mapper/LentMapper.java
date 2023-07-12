package org.ftclub.cabinet.mapper;

import static org.mapstruct.NullValueMappingStrategy.RETURN_DEFAULT;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.dto.ActiveLentHistoryDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.user.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

//@NullableMapper
@Mapper(componentModel = "spring",
		nullValueMappingStrategy = RETURN_DEFAULT,
		nullValueMapMappingStrategy = RETURN_DEFAULT,
		nullValueIterableMappingStrategy = RETURN_DEFAULT)
@Component
public interface LentMapper {

	LentMapper INSTANCE = org.mapstruct.factory.Mappers.getMapper(LentMapper.class);

	/*------------------------------------DTO------------------------------------*/

	// String name -> User user
	@Mapping(target = "userId", source = "user.userId")
	LentDto toLentDto(User user, LentHistory lentHistory);

	@Mapping(target = "userId", source = "lentHistory.userId")
	@Mapping(target = "cabinetId", source = "cabinet.cabinetId")
	@Mapping(target = "location", source = "cabinet.cabinetPlace.location")
	LentHistoryDto toLentHistoryDto(LentHistory lentHistory, User user, Cabinet cabinet);


	/*--------------------------------Wrapped DTO--------------------------------*/

	@Mapping(target = "totalLength", source = "totalLength")
	LentHistoryPaginationDto toLentHistoryPaginationDto(List<LentHistoryDto> result,
			Long totalLength);

	@Mapping(target = "userId", source = "lentHistory.userId")
	@Mapping(target = "cabinetId", source = "cabinet.cabinetId")
	ActiveLentHistoryDto toActiveLentHistoryDto(LentHistory lentHistory,
			User user,
			Cabinet cabinet,
			Boolean isExpired,
			Long daysLeftFromExpireDate
	);
}
