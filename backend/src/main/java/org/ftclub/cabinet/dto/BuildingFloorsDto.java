package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class BuildingFloorsDto {
    private final String building;
    private final List<Integer> floors;
}
