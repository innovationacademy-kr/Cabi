package org.ftclub.cabinet.mapper;

import java.util.Date;
import org.ftclub.cabinet.dto.BlockedUserDto;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public interface UserMapper {

    UserMapper INSTANCE = org.mapstruct.factory.Mappers.getMapper(UserMapper.class);

    BlockedUserDto toBlockedUserDto(Long userId, String name, Date bannedAt, Date unBannedAt);
}
