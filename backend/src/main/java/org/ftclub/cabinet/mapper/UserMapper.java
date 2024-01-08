package org.ftclub.cabinet.mapper;

import org.ftclub.cabinet.alarm.dto.AlarmTypeResponseDto;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.dto.*;
import org.ftclub.cabinet.user.domain.AlarmStatus;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.ftclub.cabinet.user.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import java.util.List;

import static org.mapstruct.NullValueMappingStrategy.RETURN_DEFAULT;
import static org.mapstruct.NullValueMappingStrategy.RETURN_NULL;

//@NullableMapper
@Mapper(componentModel = "spring",
		nullValueMappingStrategy = RETURN_NULL,
		nullValueMapMappingStrategy = RETURN_DEFAULT,
		nullValueIterableMappingStrategy = RETURN_DEFAULT)
@Component
public interface UserMapper {

	UserMapper INSTANCE = org.mapstruct.factory.Mappers.getMapper(UserMapper.class);

	@Mapping(target = "userId", source = "user.id")
	UserBlockedInfoDto toUserBlockedInfoDto(BanHistory banHistory, User user);

	@Mapping(target = "userId", source = "user.id")
	UserProfileDto toUserProfileDto(User user);

	@Mapping(target = "userId", source = "user.userId")
	@Mapping(target = "name", source = "user.name")
	@Mapping(target = "cabinetId", source = "cabinet.id")
	MyProfileResponseDto toMyProfileResponseDto(UserSessionDto user, Cabinet cabinet,
	                                            BanHistory banHistory, LentExtensionResponseDto lentExtensionResponseDto,
	                                            AlarmTypeResponseDto alarmTypes);

	BlockedUserPaginationDto toBlockedUserPaginationDto(List<UserBlockedInfoDto> result,
	                                                    Long totalLength);

	UserProfilePaginationDto toUserProfilePaginationDto(List<UserProfileDto> result,
	                                                    Long totalLength);

	ClubUserListDto toClubUserListDto(List<UserProfileDto> result, Long totalLength);

	@Mapping(target = "lentExtensionId", source = "lentExtension.id")
	LentExtensionResponseDto toLentExtensionResponseDto(LentExtension lentExtension);

	LentExtensionPaginationDto toLentExtensionPaginationDto(List<LentExtensionResponseDto> result,
	                                                        Long totalLength);


	@Mapping(target = "alarmStatus", source = "alarmStatus")
	AlarmTypeResponseDto toAlarmTypeResponseDto(AlarmStatus alarmStatus);
}
