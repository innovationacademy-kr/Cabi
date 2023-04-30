package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class BuildingFloorsResponseDto {
    private final List<BuildingFloorsDto> buildingFloors;
}
