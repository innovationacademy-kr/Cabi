package org.ftclub.cabinet.mapper;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.BuildingFloorsResponseDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CabinetMapper {

	CabinetMapper INSTANCE = Mappers.getMapper(CabinetMapper.class);

	CabinetDto toCabinetDto(String title, Location location, Cabinet cabinet);

	BuildingFloorsDto toBuildingFloorsDto(String building, List<Integer> floors);

	BuildingFloorsResponseDto toBuildingFloorsResponseDto(List<BuildingFloorsDto> buildingFloors);
}
