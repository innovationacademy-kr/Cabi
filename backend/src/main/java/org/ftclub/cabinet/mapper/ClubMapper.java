package org.ftclub.cabinet.mapper;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.dto.ClubInfoDto;
import org.ftclub.cabinet.dto.ClubInfoPaginationDto;
import org.ftclub.cabinet.dto.ClubInfoResponseDto;
import org.ftclub.cabinet.dto.ClubUserResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueMappingStrategy;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring",
		nullValueMappingStrategy = NullValueMappingStrategy.RETURN_NULL,
		nullValueMapMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT,
		nullValueIterableMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT
)
@Component
public interface ClubMapper {

	ClubMapper INSTANCE = org.mapstruct.factory.Mappers.getMapper(ClubMapper.class);

	ClubInfoDto toClubInfoDto(Long clubId, String clubName, String clubMaster);

	ClubInfoPaginationDto toClubInfoPaginationDto(List<ClubInfoDto> result, Long totalLength);

	ClubUserResponseDto toClubUserResponseDto(Long userId, String userName);

	@Mapping(target = "clubMemo", source = "cabinet.memo")
	@Mapping(target = "location", source = "cabinet.cabinetPlace.location")
	ClubInfoResponseDto toClubInfoResponseDto(String clubName, ClubUserResponseDto clubMaster,
			String clubNotice, Cabinet cabinet,
			List<ClubUserResponseDto> clubUsers, Long clubUserCount);
}
