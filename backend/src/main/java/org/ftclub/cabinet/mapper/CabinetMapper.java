package org.ftclub.cabinet.mapper;

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
import org.ftclub.cabinet.utils.annotations.NullableMapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

@NullableMapper
@Component
public interface CabinetMapper {

	CabinetMapper INSTANCE = Mappers.getMapper(CabinetMapper.class);

	CabinetDto toCabinetDto(Location location, Cabinet cabinet);

	BuildingFloorsDto toBuildingFloorsDto(String buildingName, List<Integer> floors);

	CabinetInfoResponseDto toCabinetInfoResponseDto(CabinetDto cabinetDto, List<LentDto> lents);

	CabinetsPerSectionResponseDto toCabinetsPerSectionResponseDto(String section,
			List<CabinetInfoResponseDto> cabinets);

	@Mapping(target = "totalPage", source = "totalPage")
	CabinetPaginationDto toCabinetPaginationDtoList(List<Cabinet> result,
			Integer totalPage);

	OverdueUserCabinetDto toOverdueUserCabinetDto(LentHistory lentHistory, String name,
			Location location, Long overdueDays);

	OverdueUserCabinetPaginationDto toOverdueUserCabinetPaginationDto(
			List<OverdueUserCabinetDto> result, Integer totalPage);

	MyCabinetResponseDto toMyCabinetResponseDto(CabinetDto cabinetDto, String memo,
			List<LentDto> lents);
}
