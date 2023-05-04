package org.ftclub.cabinet.cabinet.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.dto.BuildingFloorsResponseDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CabinetFacadeServiceImpl implements CabinetFacadeService {

	private final CabinetService cabinetService;

	CabinetDto getCabinet(Long cabinetId) {
		Cabinet cabinet = cabinetService.getCabinet(cabinetId);
		Location location = cabinetService.getLocationByCabinetId(cabinetId);
		return cabinetService.getCabinet(cabinetId);
	}

	BuildingFloorsResponseDto getBuildingFloors() {

		return new BuildingFloorsResponseDto(cabinetService.getBuildingFloors());
	}

	CabinetInfoResponseDto getCabinetInfo(Long cabinetId) {
		return null;
	}

	List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building, Integer floor) {
		return null;
	}

	void updateStatus(Long cabinetId, CabinetStatus status) {
	}

	void updateStatusByUserCount(Long cabinetId, Integer userCount) {
	}

	void updateMemo(Long cabinetId, String memo) {
	}

	void updateVisibleNum(Long cabinetId, Integer visibleNum) {
	}

	void updateTitle(Long cabinetId, String title) {
	}

	void updateLocationByCabinetPlaceId(Long cabinetId, String building, Integer floor,
			String section) {
	}

	void updateMaxUser(Long cabinetId, Integer maxUser) {
	}

	void updateLentType(Long cabinetId, LentType lentType) {
	}

	void updateGrid(Long cabinetId, Integer row, Integer col) {
	}

	void updateStatusNote(Long cabinetId, String statusNote) {
	}
}
