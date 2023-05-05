package org.ftclub.cabinet.mapper;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.user.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LentMapper {

	LentMapper INSTANCE = org.mapstruct.factory.Mappers.getMapper(LentMapper.class);

	LentDto toLentDto(String name, LentHistory lentHistory);

	@Mapping(target = "userId", source = "lentHistory.userId")
	@Mapping(target = "cabinetId", source = "cabinet.cabinetId")
	LentHistoryDto toLentHistoryDto(LentHistory lentHistory, User user, Cabinet cabinet,
			Location location);
}
