package org.ftclub.cabinet.cabinet.newService;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.ActiveCabinetInfoEntities;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class CabinetQueryService {

	private final CabinetRepository cabinetRepository;

	public int countCabinets(CabinetStatus status, Integer floor) {
		log.debug("Called countCabinets {} {}", status, floor);
		return cabinetRepository.countByStatusAndFloor(status, floor);
	}

	/*------------------------------------------  GET  -------------------------------------------*/


	public List<String> getAllBuildings() {
		log.debug("Called getAllBuildings");
		return cabinetRepository.getAllBuildings()
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_BUILDING));
	}

	/*------------------------------------------  FIND  -------------------------------------------*/

	public List<String> findAllBuildings() {
		log.debug("Called findAllBuildings");
		return cabinetRepository.findAllBuildings();
	}

	public List<Integer> findAllFloorsByBuilding(String building) {
		log.debug("Called findAllFloorsByBuilding {}", building);
		return cabinetRepository.findAllFloorsByBuilding(building);
	}

	public List<Integer> findAllFloorsByBuildings(List<String> buildings) {
		log.debug("Called findAllFloorsByBuildings");
		return cabinetRepository.findAllFloorsByBuildings(buildings);
	}

	public Cabinet findCabinets(Long cabinetId) {
		log.debug("Called findCabinets: {}", cabinetId);
		Optional<Cabinet> cabinet = cabinetRepository.findById(cabinetId);
		return cabinet.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public Cabinet findCabinetsWithLock(Long cabinetId) {
		log.debug("Called findCabinetsWithLock: {}", cabinetId);
		Optional<Cabinet> cabinet = cabinetRepository.findByIdWithLock(cabinetId);
		return cabinet.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public List<Cabinet> findCabinets(Integer visibleNum) {
		log.debug("Called findCabinets: {}", visibleNum);
		return cabinetRepository.findAllByVisibleNum(visibleNum);
	}

	public Page<Cabinet> findCabinets(Integer visibleNum, PageRequest pageable) {
		log.debug("Called findCabinets: {}", visibleNum);
		return cabinetRepository.findPaginationByVisibleNum(visibleNum, pageable);
	}

	public List<Cabinet> findCabinetsWithLock(List<Long> cabinetIds) {
		log.debug("Called findCabinetsWithLock: {}", cabinetIds);
		return cabinetRepository.findAllByIdsWithLock(cabinetIds);
	}

	public Cabinet getUserActiveCabinetWithLock(Long userId) {
		log.debug("Called getUserActiveCabinetWithLock: {}", userId);
		Optional<Cabinet> cabinet =
				cabinetRepository.findByUserIdAndLentHistoryEndedAtIsNullWithLock(userId);
		return cabinet.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public Cabinet findUserActiveCabinet(Long userId) {
		log.debug("Called findUserActiveCabinet: {}", userId);
		Optional<Cabinet> cabinet =
				cabinetRepository.findByUserIdAndLentHistoryEndedAtIsNull(userId);
		return cabinet.orElse(null);
	}

	public List<Cabinet> findAllCabinetsByBuildingAndFloor(String building, Integer floor) {
		log.debug("Called findAllCabinetsByBuildingAndFloor");
		return cabinetRepository.findAllByBuildingAndFloor(building, floor);
	}


	public List<ActiveCabinetInfoEntities> findActiveCabinetInfoEntities(String building,
			Integer floor) {
		log.debug("Called findActiveCabinetInfoEntities");
		return cabinetRepository.findCabinetsActiveLentHistoriesByBuildingAndFloor(building, floor);
	}

	public List<Cabinet> findPendingCabinetsNotLentTypeAndStatus(
			String building, LentType lentType, List<CabinetStatus> cabinetStatuses) {
		log.debug("Called findPendingCabinetsNotLentTypeAndStatus");
		return cabinetRepository.findAllByBuildingAndLentTypeNotAndStatusIn(building, lentType,
				cabinetStatuses);
	}

	public Cabinet findActiveCabinetByUserId(Long userId) {
		log.debug("Called findActiveLentCabinetByUserId: {}", userId);
		return cabinetRepository.findByUserIdAndLentHistoryEndedAtIsNull(userId).orElse(null);
	}
}
