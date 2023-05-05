package org.ftclub.cabinet.mapper;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CabinetMapper {

	CabinetMapper INSTANCE = Mappers.getMapper(CabinetMapper.class);

	CabinetDto toCabinetDto(Location location, Cabinet cabinet);

	BuildingFloorsDto toBuildingFloorsDto(String building, List<Integer> floors);

	//mapping이 안 되는 문제.. 무엇이 이유인지 모르겠어서 리스트로 반환하도록 설정해놓았음.
//	@Mapping(target = "result", source = "buildingFloors", expression = "java(buildingFloors)")
//	BuildingFloorsResponseDto toBuildingFloorsResponseDto(List<BuildingFloorsDto> buildingFloors);

	CabinetInfoResponseDto toCabinetInfoResponseDto(CabinetDto cabinetDto, List<LentDto> lents);

	CabinetsPerSectionResponseDto toCabinetsPerSectionResponseDto(String section,
			List<Cabinet> cabinets);
}
