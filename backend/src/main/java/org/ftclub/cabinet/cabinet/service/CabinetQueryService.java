package org.ftclub.cabinet.cabinet.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.ActiveCabinetInfoEntities;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class CabinetQueryService {

	private final CabinetRepository cabinetRepository;

	/**
	 * 해당 건물의 층에 해당하는 사물함의 개수를 반환합니다.
	 *
	 * @param status 사물함 상태
	 * @param floor  층
	 * @return 사물함 개수
	 */
	public int countCabinets(CabinetStatus status, Integer floor) {
		return cabinetRepository.countByStatusAndFloor(status, floor);
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
	 * @return 건물에 해당하는 모든 층
	 */
	public List<Integer> findAllFloorsByBuilding(String building) {
		return cabinetRepository.findAllFloorsByBuilding(building);
	}

	/**
	 * 여러 건물에 해당하는 모든 층을 가져옵니다.
	 *
	 * @param buildings 건물 이름
	 * @return 건물에 해당하는 모든 층
	 */
	public List<Integer> findAllFloorsByBuildings(List<String> buildings) {
		return cabinetRepository.findAllFloorsByBuildings(buildings);
	}

	/**
	 * 사물함을 ID로 가져옵니다.
	 *
	 * @param cabinetId 가져올 사물함 ID
	 * @return 사물함
	 */
	public Cabinet getCabinet(Long cabinetId) {
		Optional<Cabinet> cabinet = cabinetRepository.findById(cabinetId);
		return cabinet.orElseThrow(ExceptionStatus.NOT_FOUND_CABINET::asServiceException);
	}

	/**
	 * 사물함을 ID로 가져옵니다.(조회 이후 업데이트를 위해 X Lock을 건다.)
	 *
	 * @param cabinetId 가져올 사물함 ID
	 * @return 사물함
	 */
	public Cabinet getCabinetForUpdate(Long cabinetId) {
		Optional<Cabinet> cabinet = cabinetRepository.findByIdWithXLock(cabinetId);
		return cabinet.orElseThrow(ExceptionStatus.NOT_FOUND_CABINET::asServiceException);
	}

	/**
	 * 사물함 번호에 해당하는 모든 사물함을 가져옵니다.
	 *
	 * @param visibleNum 사물함 번호
	 * @return 사물함
	 */
	public List<Cabinet> findCabinets(Integer visibleNum) {
		return cabinetRepository.findAllByVisibleNum(visibleNum);
	}

	/**
	 * 사물함 번호에 해당하는 모든 사물함을 가져옵니다. (변경을 위해 X락을 걸고 가져옵니다.)
	 *
	 * @param cabinetIds 사물함 번호
	 * @return 사물함
	 */
	public List<Cabinet> findCabinetsForUpdate(List<Long> cabinetIds) {
		return cabinetRepository.findAllByIdsWithXLock(cabinetIds);
	}

	/**
	 * 사물함ID로 현재 대여중인 사물함을 가져옵니다.(변경을 위해 X 락을 걸어 가져옵니다.)
	 *
	 * @param userId 사용자 ID
	 * @return 사물함
	 */
	public Cabinet getUserActiveCabinetForUpdate(Long userId) {
		Optional<Cabinet> cabinet =
				cabinetRepository.findByUserIdAndLentHistoryEndedAtIsNullWithXLock(userId);
		return cabinet.orElseThrow(ExceptionStatus.NOT_FOUND_CABINET::asServiceException);
	}

	public Cabinet getUserActiveCabinet(Long userId) {
		Optional<Cabinet> cabinet =
				cabinetRepository.findByUserIdAndLentHistoryEndedAtIsNullWithXLock(userId);
		return cabinet.orElseThrow(ExceptionStatus.NOT_FOUND_CABINET::asServiceException);
	}

	/**
	 * 사물함ID로 현재 대여중인 사물함을 가져옵니다.
	 *
	 * @param userId 사용자 ID
	 * @return 사물함
	 */
	public Cabinet findUserActiveCabinet(Long userId) {
		Optional<Cabinet> cabinet =
				cabinetRepository.findByUserIdAndLentHistoryEndedAtIsNull(userId);
		return cabinet.orElse(null);
	}

	/**
	 * 건물, 층에 해당아흔 모든 사물함을 가져옵니다.
	 *
	 * @param building 건물 이름
	 * @param floor    층
	 * @return 사물함
	 */
	public List<Cabinet> findAllCabinetsByBuildingAndFloor(String building, Integer floor) {
		return cabinetRepository.findAllByBuildingAndFloor(building, floor);
	}

	/**
	 * 건물, 층에 해당하는 대여중인 사물함, 사물함 대여기록, 유저를 JOIN 하여 가져옵니다.
	 *
	 * @param building 건물 이름
	 * @param floor    층
	 * @return 사물함
	 */
	public List<ActiveCabinetInfoEntities> findActiveCabinetInfoEntities(String building,
			Integer floor) {
		return cabinetRepository.findCabinetsActiveLentHistoriesByBuildingAndFloor(building, floor);
	}

	/**
	 * 건물에 있는 모든 사물함 중, LentType에 해당하지않고, cabinetStatuses에 해당하는 모든 사물함을 가져옵니다.
	 *
	 * @param building        건물 이름
	 * @param lentType        포함하지 않을 대여 타입
	 * @param cabinetStatuses 사물함 상태
	 * @return 사물함
	 */
	public List<Cabinet> findCabinetsNotLentTypeAndStatus(
			String building, LentType lentType, List<CabinetStatus> cabinetStatuses) {
		return cabinetRepository.findAllByBuildingAndLentTypeNotAndStatusIn(building, lentType,
				cabinetStatuses);
	}

	/**
	 * userId로 현재 대여중인 사물함을 가져옵니다.
	 *
	 * @param userId 사용자 ID
	 * @return 사물함
	 */
	public Cabinet findActiveCabinetByUserId(Long userId) {
		return cabinetRepository.findByUserIdAndLentHistoryEndedAtIsNull(userId).orElse(null);
	}

	/**
	 * status에 해당하는 사물함을 page로 가져옵니다.
	 *
	 * @param status   사물함 상태
	 * @param pageable 페이지 정보
	 * @return 사물함
	 */
	public Page<Cabinet> findAllByStatus(CabinetStatus status, Pageable pageable) {
		return cabinetRepository.findPaginationByStatus(status, pageable);
	}

	/**
	 * 사물함 상태에 맞는 사물함들 중 from 이전에 대여기간이 만료되는 사물함을 가져옵니다.
	 *
	 * @param cabinetStatus 사물함 상태
	 * @param from          조회할 시간
	 * @return 사물함
	 */
	public List<Cabinet> findAllPendingCabinetsByCabinetStatusAndBeforeEndedAt(
			CabinetStatus cabinetStatus, LocalDateTime from) {
		return cabinetRepository.findAllCabinetsByCabinetStatusAndBeforeEndedAt(cabinetStatus,
				from);
	}
}
