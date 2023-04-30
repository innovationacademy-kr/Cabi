package org.ftclub.cabinet.cabinet.service;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.dto.BuildingFloorsResponseDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;

public interface CabinetService {

    CabinetDto getCabinetById(Long cabinetId);

    BuildingFloorsResponseDto getBuildingFloors();

    CabinetInfoResponseDto getCabinetInfo(Long cabinetId);

    List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building, Integer floor);

    void updateCabinetStatus(Long cabinetId, CabinetStatus status);

    void updateCabinetStatusByUserCount(Long cabinetId, Integer userCount);

}
