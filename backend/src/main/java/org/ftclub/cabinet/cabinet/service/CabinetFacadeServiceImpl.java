package org.ftclub.cabinet.cabinet.service;

import java.util.ArrayList;
import java.util.List;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetPaginationDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class CabinetFacadeServiceImpl implements CabinetFacadeService {

	private final CabinetService cabinetService;
	private final CabinetRepository cabinetRepository;
	private final LentRepository lentRepository;
	private final UserRepository userRepository;
	private final CabinetMapper cabinetMapper;
	private final LentMapper lentMapper;


	/**
	 * {@inheritDoc}
	 * <p>
	 * 존재하는 모든 건물들을 가져오고, 각 건물별 층 정보들을 가져옵니다.
	 */
	@Override
	public List<BuildingFloorsDto> getBuildingFloorsResponse() {
		List<BuildingFloorsDto> buildingFloors = new ArrayList<>();
		List<String> buildings = cabinetRepository.findAllBuildings().orElseThrow();
		for (String building : buildings) {
			List<Integer> floors = cabinetRepository.findAllFloorsByBuilding(building)
					.orElseThrow();
			buildingFloors.add(cabinetMapper.toBuildingFloorsDto(building, floors));
		}
		return buildingFloors;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public CabinetInfoResponseDto getCabinetInfo(Long cabinetId) {
		if (!cabinetRepository.existsById(cabinetId)) {
			throw new ServiceException(ExceptionStatus.NOT_FOUND_CABINET);
		}
		List<LentDto> lentDtos = new ArrayList<>();
		List<LentHistory> lentHistories = lentRepository.findAllActiveLentByCabinetId(cabinetId);
		for (LentHistory lentHistory : lentHistories) {
			String name = userRepository.findNameById(lentHistory.getUserId());
			lentDtos.add(lentMapper.toLentDto(name, lentHistory));
		}
		return cabinetMapper.toCabinetInfoResponseDto(getCabinet(cabinetId), lentDtos);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building,
			Integer floor) {
		if (!cabinetRepository.existsBuildingAndFloor(building, floor) || building.isEmpty()) {
			throw new ServiceException(ExceptionStatus.INVALID_ARGUMENT);
		}
		List<CabinetsPerSectionResponseDto> result = new ArrayList<>();
		List<String> sections = cabinetRepository.findAllSectionsByBuildingAndFloor(building, floor)
				.orElseThrow();
		for (String section : sections) {
			List<Long> cabinetIds = cabinetRepository.findAllCabinetIdsBySection(section)
					.orElseThrow();
			result.add(cabinetMapper.toCabinetsPerSectionResponseDto(section,
					getCabinetInfoBundle(cabinetIds)));
		}
		return result;
	}


	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateCabinetStatus(Long cabinetId, CabinetStatus status) {
		cabinetService.updateStatus(cabinetId, status);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateCabinetLentType(Long cabinetId, LentType lentType) {
		cabinetService.updateLentType(cabinetId, lentType);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateCabinetStatusNote(Long cabinetId, String statusNote) {
		cabinetService.updateStatusNote(cabinetId, statusNote);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateCabinetTitle(Long cabinetId, String title) {
		cabinetService.updateTitle(cabinetId, title);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateCabinetMemo(Long cabinetId, String memo) {
		cabinetService.updateMemo(cabinetId, memo);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateCabinetGrid(Long cabinetId, Integer row, Integer col) {
		cabinetService.updateGrid(cabinetId, Grid.of(row, col));
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateCabinetVisibleNum(Long cabinetId, Integer visibleNum) {
		cabinetService.updateVisibleNum(cabinetId, visibleNum);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateCabinetBundleStatus(List<Long> cabinetIds, CabinetStatus status) {
		for (Long cabinetId : cabinetIds) {
			cabinetService.updateStatus(cabinetId, status);
		}
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void updateCabinetBundleLentType(List<Long> cabinetIds, LentType lentType) {
		for (Long cabinetId : cabinetIds) {
			cabinetService.updateLentType(cabinetId, lentType);
		}
	}

	@Override
	public CabinetPaginationDto getCabinetListByLentType(LentType lentType, Integer page,
			Integer length) {
		PageRequest pageable = PageRequest.of(page, length);
		List<Cabinet> cabinets = cabinetRepository.findAllCabinetsByLentType(lentType, pageable);
		return cabinetMapper.toCabinetPaginationDtoList(cabinets, page * length);
	}

	@Override
	public CabinetPaginationDto getCabinetListByStatus(CabinetStatus status, Integer page,
			Integer length) {
		PageRequest pageable = PageRequest.of(page, length);
		List<Cabinet> cabinets = cabinetRepository.findAllCabinetsByStatus(status, pageable);
		return cabinetMapper.toCabinetPaginationDtoList(cabinets, page * length);
	}

	@Override
	public CabinetPaginationDto getCabinetListByVisibleNum(Integer visibleNum, Integer page,
			Integer length) {
		PageRequest pageable = PageRequest.of(page, length);
		List<Cabinet> cabinets = cabinetRepository.findAllCabinetsByVisibleNum(visibleNum,
				pageable);
		return cabinetMapper.toCabinetPaginationDtoList(cabinets, page * length);
	}

	/**
	 * 사물함 정보와 위치 정보를 가져옵니다.
	 *
	 * @param cabinetId 사물함 id
	 * @return 사물함과 위치 정보
	 * @throws ServiceException 존재하지 않는 사물함인 경우 예외 발생
	 */
	public CabinetDto getCabinet(Long cabinetId) {
		Cabinet cabinet = cabinetRepository.findById(cabinetId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
		Location location = cabinetRepository.findLocationById(cabinetId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
		return cabinetMapper.toCabinetDto(location, cabinet);
	}

	/**
	 * 사물함들의 정보와 각각의 대여 정보들을 가져옵니다.
	 *
	 * @param cabinetIds 사물함 id 리스트
	 * @return 사물함 정보 리스트
	 */
	public List<CabinetInfoResponseDto> getCabinetInfoBundle(List<Long> cabinetIds) {
		List<CabinetInfoResponseDto> result = new ArrayList<>();
		for (Long cabinetId : cabinetIds) {
			result.add(getCabinetInfo(cabinetId));
		}
		return result;
	}
}
