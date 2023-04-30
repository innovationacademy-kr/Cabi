package org.ftclub.cabinet.mapper;

import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LentMapper {

    LentMapper INSTANCE = org.mapstruct.factory.Mappers.getMapper(LentMapper.class);

    LentDto toLentDto(String name, LentHistory lentHistory);
}
