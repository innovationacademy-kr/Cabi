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

/**
 * CabinetService를 위한 ExceptionService
 */
@Service
@RequiredArgsConstructor
public class CabinetExceptionHandlerService {

	private final CabinetRepository cabinetRepository;

	/**
	 * 사물함 ID로 사물함을 찾습니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @return 사물함 엔티티
	 * @throws ServiceException 사물함을 찾을 수 없는 경우
	 */
	public Cabinet getCabinet(Long cabinetId) {
		return cabinetRepository.findById(cabinetId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	/**
	 * 사물함 ID로 동아리 사물함을 찾습니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @return 동아리 사물함 엔티티
	 * @throws ServiceException 사물함을 찾을 수 없는 경우
	 */
	public Cabinet getClubCabinet(Long cabinetId) {
		Cabinet cabinet = getCabinet(cabinetId);
		if (!cabinet.isLentType(LentType.CLUB)) {
			throw new ServiceException(ExceptionStatus.NOT_FOUND_CABINET);
		}
		return cabinet;
	}

	/**
	 * 사물함 ID로 위치(빌딩, 층, 섹션) 정보를 찾습니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @return 위치 엔티티
	 * @throws ServiceException 사물함을 찾을 수 없는 경우
	 */
	public Location getLocation(Long cabinetId) {
		return cabinetRepository.findLocationById(cabinetId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	/**
	 * 섹션으로 그 섹션에 있는 모든 사물함의 ID를 찾습니다.
	 *
	 * @param section 섹션
	 * @return 섹션에 있는 사물함들의 ID 리스트
	 * @throws ServiceException 사물함을 찾을 수 없는 경우
	 */
	public List<Long> getAllCabinetIdsBySection(String section) {
		return cabinetRepository.findAllCabinetIdsBySection(section)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}

	/**
	 * 위치(빌딩, 층, 섹션)으로 그 위치에 해당하는 사물함 구역을 찾습니다.
	 *
	 * @param location 위치
	 * @return 사물함 구역 엔티티
	 * @throws ServiceException 사물함을 찾을 수 없는 경우
	 */
	public CabinetPlace getCabinetPlaceByLocation(Location location) {
		return cabinetRepository.findCabinetPlaceByLocation(location)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
	}
}
