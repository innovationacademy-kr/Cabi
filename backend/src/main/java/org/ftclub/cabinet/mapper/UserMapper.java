package org.ftclub.cabinet.mapper;

import org.ftclub.cabinet.dto.UserBlockedInfoDto;
import org.ftclub.cabinet.dto.UserProfileDto;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.utils.annotations.NullableMapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@NullableMapper
@Component
public interface UserMapper {

	UserMapper INSTANCE = org.mapstruct.factory.Mappers.getMapper(UserMapper.class);

	@Mapping(target = "name", source = "name")
	UserBlockedInfoDto toUserBlockedInfoDto(BanHistory banHistory, String name);

	UserProfileDto toUserProfileDto(User user);
}
