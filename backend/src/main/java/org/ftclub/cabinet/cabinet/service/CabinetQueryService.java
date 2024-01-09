package org.ftclub.cabinet.cabinet.service;

import java.time.LocalDateTime;
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

	/**
	 * 해당 건물의 층에 해당하는 사물함의 개수를 반환합니다.
	 *
	 * @param status 사물함 상태
	 * @param floor  층
	 * @return
	 */
	public int countCabinets(CabinetStatus status, Integer floor) {
		return cabinetRepository.countByStatusAndFloor(status, floor);
	}

	/*------------------------------------------  GET  -------------------------------------------*/


	/**
	 * 모든 건물을 가져옵니다.(새롬관, 서초)
	 *
	 * @return 모든 건물 이름을 반환합니다.
	 */
	public List<String> getAllBuildings() {
		return cabinetRepository.getAllBuildings()
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_BUILDING));
	}

	/*------------------------------------------  FIND  -------------------------------------------*/

	/**
	 * 모든 건물을 가져옵니다.(새롬관, 서초)
	 *
	 * @return 모든 건물 이름을 반환합니다.
	 */
	public List<String> findAllBuildings() {
		return cabinetRepository.findAllBuildings();
	}

	/**
	 * 건물에 해당하는 모든 층을 가져옵니다.
	 *
	 * @param building 건물 이름
	 * @return
	 */

	public List<Integer> findAllFloorsByBuilding(String building) {
		return cabinetRepository.findAllFloorsByBuilding(building);
	}

	public List<Integer> findAllFloorsByBuildings(List<String> buildings) {
		return cabinetRepository.findAllFloorsByBuildings(buildings);
	}

	public Cabinet findCabinet(Long cabinetId) {
		Optional<Cabinet> cabinet = cabinetRepository.findById(cabinetId);
		return cabinet.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public Cabinet findCabinetsWithXLock(Long cabinetId) {
		Optional<Cabinet> cabinet = cabinetRepository.findByIdWithXLock(cabinetId);
		return cabinet.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public List<Cabinet> findCabinets(Integer visibleNum) {
		return cabinetRepository.findAllByVisibleNum(visibleNum);
	}

	public Page<Cabinet> findCabinets(Integer visibleNum, PageRequest pageable) {
		return cabinetRepository.findPaginationByVisibleNum(visibleNum, pageable);
	}

	public List<Cabinet> findCabinetsForUpdate(List<Long> cabinetIds) {
		return cabinetRepository.findAllByIdsWithXLock(cabinetIds);
	}

	public Cabinet getUserActiveCabinetForUpdate(Long userId) {
		Optional<Cabinet> cabinet =
				cabinetRepository.findByUserIdAndLentHistoryEndedAtIsNullWithXLock(userId);
		return cabinet.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	public Cabinet getUserActiveCabinet(Long userId) {
		Optional<Cabinet> cabinet =
				cabinetRepository.findByUserIdAndLentHistoryEndedAtIsNullWithXLock(userId);
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

	public List<Cabinet> findAllByBuildingAndFloor(String building, Integer floor) {
		return cabinetRepository.findAllByBuildingAndFloor(building, floor);
	}

	public List<Cabinet> findAllPendingCabinetsByCabinetStatusAndBeforeEndedAt(
			CabinetStatus cabinetStatus, LocalDateTime from) {
		return cabinetRepository.findAllCabinetsByCabinetStatusAndBeforeEndedAt(cabinetStatus,
				from);
	}
}
