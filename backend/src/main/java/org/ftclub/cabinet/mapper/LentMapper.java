package org.ftclub.cabinet.mapper;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryWithNameExpiredAtDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.user.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public interface LentMapper {

    LentMapper INSTANCE = org.mapstruct.factory.Mappers.getMapper(LentMapper.class);

    LentDto toLentDto(String name, LentHistory lentHistory);

    @Mapping(target = "userId", source = "lentHistory.userId")
    @Mapping(target = "cabinetId", source = "cabinet.cabinetId")
    @Mapping(target = "location", source = "cabinet.cabinetPlace.location")
    LentHistoryDto toLentHistoryDto(LentHistory lentHistory, User user, Cabinet cabinet);

    @Mapping(target = "userId", source = "lentHistory.userId")
    @Mapping(target = "cabinetId", source = "cabinet.cabinetId")
    LentHistoryWithNameExpiredAtDto toLentHistoryWithExpiredAtDto(LentHistory lentHistory,
            User user,
            Cabinet cabinet);
}
