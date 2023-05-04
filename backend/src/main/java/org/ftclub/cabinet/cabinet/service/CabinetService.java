package org.ftclub.cabinet.cabinet.service;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;

public interface CabinetService {

	Cabinet getCabinet(Long cabinetId);

	Location getLocationByCabinetId(Long cabinetId);

	public List<String> getAllBuildings();

	public List<Integer> getAllFloorsByBuilding(String building);

	CabinetInfoResponseDto getCabinetInfo(Long cabinetId);

	List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building, Integer floor);

	void updateStatus(Long cabinetId, CabinetStatus status);

	void updateStatusByUserCount(Long cabinetId, Integer userCount);

	void changeCabinetPlaceByLocation(Long cabinetId, Location location);

	void updateMemo(Long cabinetId, String memo);

	void updateVisibleNum(Long cabinetId, Integer visibleNum);

	void updateTitle(Long cabinetId, String title);

	void updateLocation(Long cabinetId, Location location);

	void updateMaxUser(Long cabinetId, Integer maxUser);

	void updateLentType(Long cabinetId, LentType lentType);

	void updateGrid(Long cabinetId, Grid grid);

	void updateStatusNote(Long cabinetId, String statusNote);
}
