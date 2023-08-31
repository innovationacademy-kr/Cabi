package org.ftclub.cabinet.mapper;

import static org.mapstruct.NullValueMappingStrategy.RETURN_DEFAULT;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.ClubUserListDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserBlockedInfoDto;
import org.ftclub.cabinet.dto.UserProfileDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.user.domain.BanHistory;
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
public interface UserMapper {

	UserMapper INSTANCE = org.mapstruct.factory.Mappers.getMapper(UserMapper.class);

	@Mapping(target = "userId", source = "user.userId")
	UserBlockedInfoDto toUserBlockedInfoDto(BanHistory banHistory, User user);

	UserProfileDto toUserProfileDto(User user);

	@Mapping(target = "userId", source = "user.userId")
	@Mapping(target = "cabinetId", source = "cabinet.cabinetId")
	MyProfileResponseDto toMyProfileResponseDto(UserSessionDto user, Cabinet cabinet,
			BanHistory banHistory, boolean isExtensible);

	BlockedUserPaginationDto toBlockedUserPaginationDto(List<UserBlockedInfoDto> result,
			Long totalLength);

	UserProfilePaginationDto toUserProfilePaginationDto(List<UserProfileDto> result,
			Long totalLength);

	ClubUserListDto toClubUserListDto(List<UserProfileDto> result, Long totalLength);
}
