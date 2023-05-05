package org.ftclub.cabinet.cabinet.service;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;

public interface CabinetFacadeService {

	List<BuildingFloorsDto> getBuildingFloorsResponse();

	CabinetInfoResponseDto getCabinetInfo(Long cabinetId);

	List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building, Integer floor);

	void updateCabinetStatus(Long cabinetId, CabinetStatus status);

	void updateCabinetLentType(Long cabinetId, LentType lentType);

	void updateCabinetStatusNote(Long cabinetId, String statusNote);

	void updateCabinetTitle(Long cabinetId, String title);

	void updateCabinetMemo(Long cabinetId, String memo);

	void updateCabinetGrid(Long cabinetId, Grid grid);

	void updateCabinetVisibleNum(Long cabinetId, Integer visibleNum);

	void updateCabinetBundleStatus(List<Long> cabinetIds, CabinetStatus status);

	void updateCabinetBundleLentType(List<Long> cabinetIds, LentType lentType);


}
