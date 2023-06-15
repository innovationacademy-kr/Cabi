package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * 건물에 대한 층 정보입니다.
 */
@AllArgsConstructor
@Getter
@ToString
public class BuildingFloorsDto {

    private final String buildingName;
    private final List<Integer> floors;
}