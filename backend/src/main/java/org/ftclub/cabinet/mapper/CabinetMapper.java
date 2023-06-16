package org.ftclub.cabinet.mapper;

import static org.mapstruct.NullValueMappingStrategy.RETURN_DEFAULT;
import static org.mapstruct.NullValueMappingStrategy.RETURN_NULL;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetPaginationDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.MyCabinetResponseDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

//@NullableMapper
@Mapper(componentModel = "spring",
		nullValueMappingStrategy = RETURN_NULL,
		nullValueMapMappingStrategy = RETURN_DEFAULT,
		nullValueIterableMappingStrategy = RETURN_DEFAULT)
@Component
public interface CabinetMapper {

	CabinetMapper INSTANCE = Mappers.getMapper(CabinetMapper.class);

	/*------------------------------------DTO------------------------------------*/

	//CabinetPlace, Cabinet
	CabinetDto toCabinetDto(Location location, Cabinet cabinet);

	//LentHistory, User, Cabinet, CabinetPlace, (별도)overdueDays
	OverdueUserCabinetDto toOverdueUserCabinetDto(LentHistory lentHistory, String name,
			Integer visibleNum, Location location, Long overdueDays);

	//CabinetPlace, (별도)floors
	BuildingFloorsDto toBuildingFloorsDto(String building, List<Integer> floors);


	/*--------------------------------Wrapped DTO--------------------------------*/

	//CabinetPlace, List<CabinetInfoResponseDto>
	CabinetsPerSectionResponseDto toCabinetsPerSectionResponseDto(String section,
			List<CabinetInfoResponseDto> cabinets);

	//CabinetDto = CabinetPlace, Cabinet ... List<LentDto>
	CabinetInfoResponseDto toCabinetInfoResponseDto(CabinetDto cabinetDto, List<LentDto> lents);

	@Mapping(target = "totalPage", source = "totalPage")
	CabinetPaginationDto toCabinetPaginationDtoList(List<CabinetDto> result,
			Integer totalPage);

	OverdueUserCabinetPaginationDto toOverdueUserCabinetPaginationDto(
			List<OverdueUserCabinetDto> result, Integer totalPage);

	//CabinetDto = CabinetPlace, Cabinet(+memo) ... List<LentDto>
	MyCabinetResponseDto toMyCabinetResponseDto(CabinetDto cabinetDto, String memo,
			List<LentDto> lents);
}
