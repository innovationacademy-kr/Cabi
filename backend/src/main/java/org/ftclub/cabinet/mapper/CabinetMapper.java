package org.ftclub.cabinet.mapper;

import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public interface CabinetMapper {

    CabinetMapper INSTANCE = Mappers.getMapper(CabinetMapper.class);

    CabinetDto toCabinetDto(Location location, Cabinet cabinet);

    BuildingFloorsDto toBuildingFloorsDto(String building, List<Integer> floors);

    CabinetInfoResponseDto toCabinetInfoResponseDto(CabinetDto cabinetDto, List<LentDto> lents);

    CabinetsPerSectionResponseDto toCabinetsPerSectionResponseDto(String section,
            List<CabinetInfoResponseDto> cabinets);

    OverdueUserCabinetDto toOverdueUserCabinetDto(LentHistory lentHistory, String name, Optional<Location> location);

    OverdueUserCabinetPaginationDto toOverdueUserCabinetPaginationDto(
            List<OverdueUserCabinetDto> result, Integer totalLength);
}
