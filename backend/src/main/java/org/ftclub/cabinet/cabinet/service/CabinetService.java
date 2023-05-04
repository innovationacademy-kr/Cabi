package org.ftclub.cabinet.cabinet.service;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.dto.BuildingFloorsResponseDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;

public interface CabinetService {

    //    void createNewCabinet(); optional parameters -> many overloading
//    void deleteCabinet(); optional parameters -> many overloading
    // void createNewLocation;
    CabinetDto getCabinetById(Long cabinetId);

    BuildingFloorsResponseDto getBuildingFloors();

    CabinetInfoResponseDto getCabinetInfo(Long cabinetId);

    List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building, Integer floor);

    void updateStatus(Long cabinetId, CabinetStatus status);

    void updateStatusByUserCount(Long cabinetId, Integer userCount);

    void updateMemoById(Long cabinetId, String memo);

    void updateTitleById(Long cabinetId, String title);

    void updateLocationById(Long cabinetId, Location location);

    void updateLentTyById(Long cabinetId, LentType lentType);

    void updateGridById(Long cabinetId, Grid grid);

    void updateStatusNoteById(Long cabinetId, String statusNote);

//      void createNewCabinetPlace(params...);
//      void deleteCabinetPlace(cabinetplaceId);

}
