package org.ftclub.cabinet.mapper;

import org.ftclub.cabinet.dto.BlockedUserDto;
import org.ftclub.cabinet.dto.UserProfileDto;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public interface UserMapper {

    UserMapper INSTANCE = org.mapstruct.factory.Mappers.getMapper(UserMapper.class);

    @Mapping(target = "name", source = "name")
    BlockedUserDto toBlockedUserDto(BanHistory banHistory, String name);

    UserProfileDto toUserProfileDto(User user);
}
