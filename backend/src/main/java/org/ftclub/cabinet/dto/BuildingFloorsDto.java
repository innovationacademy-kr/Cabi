package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 건물에 대한 층 정보입니다.
 */
@AllArgsConstructor
@Getter
public class BuildingFloorsDto {

    private final String building;
    private final List<Integer> floors;
}