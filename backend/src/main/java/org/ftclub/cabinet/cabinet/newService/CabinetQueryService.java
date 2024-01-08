package org.ftclub.cabinet.cabinet.newService;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.ActiveCabinetInfoEntities;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class CabinetQueryService {

	private final CabinetRepository cabinetRepository;

	public int countCabinets(CabinetStatus status, Integer floor) {
		return cabinetRepository.countByStatusAndFloor(status, floor);
	}

	/*------------------------------------------  GET  -------------------------------------------*/


	public List<String> getAllBuildings() {
		return cabinetRepository.getAllBuildings()
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_BUILDING));
	}

	/*------------------------------------------  FIND  -------------------------------------------*/

	public List<String> findAllBuildings() {
		return cabinetRepository.findAllBuildings();
	}

	public List<Integer> findAllFloorsByBuilding(String building) {
		return cabinetRepository.findAllFloorsByBuilding(building);
	}

	public List<Integer> findAllFloorsByBuildings(List<String> buildings) {
		return cabinetRepository.findAllFloorsByBuildings(buildings);
	}

	public Cabinet findCabinets(Long cabinetId) {
		Optional<Cabinet> cabinet = cabinetRepository.findById(cabinetId);
		return cabinet.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public Cabinet findCabinetsWithLock(Long cabinetId) {
		Optional<Cabinet> cabinet = cabinetRepository.findByIdWithLock(cabinetId);
		return cabinet.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public List<Cabinet> findCabinets(Integer visibleNum) {
		return cabinetRepository.findAllByVisibleNum(visibleNum);
	}

	public Page<Cabinet> findCabinets(Integer visibleNum, PageRequest pageable) {
		return cabinetRepository.findPaginationByVisibleNum(visibleNum, pageable);
	}

	public List<Cabinet> findCabinetsWithLock(List<Long> cabinetIds) {
		return cabinetRepository.findAllByIdsWithLock(cabinetIds);
	}

	public Cabinet getUserActiveCabinetWithLock(Long userId) {
		Optional<Cabinet> cabinet =
				cabinetRepository.findByUserIdAndLentHistoryEndedAtIsNullWithLock(userId);
		return cabinet.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public Cabinet findUserActiveCabinet(Long userId) {
		Optional<Cabinet> cabinet =
				cabinetRepository.findByUserIdAndLentHistoryEndedAtIsNull(userId);
		return cabinet.orElse(null);
	}

	public List<Cabinet> findAllCabinetsByBuildingAndFloor(String building, Integer floor) {
		return cabinetRepository.findAllByBuildingAndFloor(building, floor);
	}


	public List<ActiveCabinetInfoEntities> findActiveCabinetInfoEntities(String building,
			Integer floor) {
		return cabinetRepository.findCabinetsActiveLentHistoriesByBuildingAndFloor(building, floor);
	}

	public List<Cabinet> findPendingCabinetsNotLentTypeAndStatus(
			String building, LentType lentType, List<CabinetStatus> cabinetStatuses) {
		return cabinetRepository.findAllByBuildingAndLentTypeNotAndStatusIn(building, lentType,
				cabinetStatuses);
	}

	public Cabinet findActiveCabinetByUserId(Long userId) {
		return cabinetRepository.findByUserIdAndLentHistoryEndedAtIsNull(userId).orElse(null);
	}

	public Page<Cabinet> findAllByLentType(LentType lentType, Pageable pageable) {
		return cabinetRepository.findPaginationByLentType(lentType, pageable);
	}

	public Page<Cabinet> findAllByStatus(CabinetStatus status, Pageable pageable) {
		return cabinetRepository.findPaginationByStatus(status, pageable);
	}

	public Page<Cabinet> findAllByVisibleNum(Integer visibleNum, Pageable pageable) {
		return cabinetRepository.findPaginationByVisibleNum(visibleNum, pageable);
	}
}
