package org.ftclub.cabinet.mapper;

import java.util.List;
import org.ftclub.cabinet.dto.ClubInfoPaginationDto;
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

	@Mapping(target = "clubId", source = "club.id")
	@Mapping(target = "name", source = "club.name")
	ClubInfoDto toClubInfoDto(Club club);

	ClubInfoPaginationDto toClubInfoPaginationDto(List<ClubInfoDto> result, Long totalElements);
}
