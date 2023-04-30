package org.ftclub.cabinet.cabinet.service;

import org.ftclub.cabinet.dto.BuildingFloorsResponseDto;
import org.ftclub.cabinet.dto.CabinetDto;

public interface CabinetService {

//    void createCabinet(CabinetDto cabinetDto);

//    void deleteCabinet(Long cabinetId);

    CabinetDto getCabinetById(Long cabinetId);

    BuildingFloorsResponseDto getBuildingFloors();

//    CabinetInfoResponseDto getCabinetInfo(Long cabinetId);
//
//    CabinetsPerSectionResponseDto getCabinetsPerSection(Location location, Integer floor);
}
