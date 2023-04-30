package org.ftclub.cabinet.mapper;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.dto.CabinetDto;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CabinetMapper {

    CabinetMapper INSTANCE = Mappers.getMapper(CabinetMapper.class);

    Cabinet toCabinet(CabinetDto cabinetDto);

    @InheritInverseConfiguration
    CabinetDto toCabinetDto(Cabinet cabinet);
}
