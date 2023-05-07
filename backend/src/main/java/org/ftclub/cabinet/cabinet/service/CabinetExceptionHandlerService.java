package org.ftclub.cabinet.cabinet.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CabinetExceptionHandlerService {

	private final CabinetRepository cabinetRepository;

	public Cabinet getCabinet(Long cabinetId) {
		return cabinetRepository.findById(cabinetId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public Cabinet getClubCabinet(Long cabinetId) {
		Cabinet cabinet = getCabinet(cabinetId);
		if (!cabinet.isLentType(LentType.CLUB)) {
			throw new ServiceException(ExceptionStatus.NOT_FOUND_CABINET);
		}
		return cabinet;
	}

	public Location getLocation(Long cabinetId) {
		return cabinetRepository.findLocationById(cabinetId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public List<String> getAllBuildings() {
		return cabinetRepository.findAllBuildings()
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public List<Integer> getAllFloorsByBuilding(String building) {
		return cabinetRepository.findAllFloorsByBuilding(building)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public List<String> getAllSectionsByBuildingAndFloor(String building, Integer floor) {
		return cabinetRepository.findAllSectionsByBuildingAndFloor(building, floor)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public List<Long> getAllCabinetIdsBySection(String section) {
		return cabinetRepository.findAllCabinetIdsBySection(section)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public CabinetPlace getCabinetPlaceByLocation(Location location) {
		return cabinetRepository.findCabinetPlaceByLocation(location)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}
}
