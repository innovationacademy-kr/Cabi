package org.ftclub.cabinet.cabinet.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoPaginationDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetPaginationDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.UpdateCabinetsRequestDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class CabinetFacadeServiceImpl implements CabinetFacadeService {
	private static final Logger logger = LogManager.getLogger(CabinetFacadeService.class);
	private final CabinetService cabinetService;
	private final CabinetOptionalFetcher cabinetOptionalFetcher;
	private final LentOptionalFetcher lentOptionalFetcher;
	private final UserOptionalFetcher userOptionalFetcher;
	private final CabinetMapper cabinetMapper;
	private final LentMapper lentMapper;

	/*-------------------------------------------READ-------------------------------------------*/

	/**
	 * {@inheritDoc}
	 * <p>
	 * 존재하는 모든 건물들을 가져오고, 각 건물별 층 정보들을 가져옵니다.
	 */
	@Override
	public List<BuildingFloorsDto> getBuildingFloorsResponse() {
		logger.info("getBuildingFloorsResponse");
		return cabinetOptionalFetcher.findAllBuildings().stream()
				.map(building -> {
					List<Integer> floors = cabinetOptionalFetcher.findAllFloorsByBuilding(building);
					return cabinetMapper.toBuildingFloorsDto(building, floors);
				})
				.collect(Collectors.toList());
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public CabinetInfoResponseDto getCabinetInfo(Long cabinetId) {
		logger.info("getCabinetInfo");
		List<LentDto> lentDtos = new ArrayList<>();
		List<LentHistory> lentHistories = lentOptionalFetcher.findAllActiveLentByCabinetId(
				cabinetId);
		for (LentHistory lentHistory : lentHistories) {
			User findUser = userOptionalFetcher.findUser(lentHistory.getUserId());
			lentDtos.add(lentMapper.toLentDto(findUser, lentHistory));
		}
		return cabinetMapper.toCabinetInfoResponseDto(cabinetOptionalFetcher.findCabinet(cabinetId),
				lentDtos);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building,
			Integer floor) {
		logger.info("getCabinetsPerSection");
		return cabinetOptionalFetcher.findAllSectionsByBuildingAndFloor(building, floor).stream()
				.map(section -> {
					List<Long> cabinetIds = cabinetOptionalFetcher.findAllCabinetIdsBySection(floor,
							section);
					return cabinetMapper.toCabinetsPerSectionResponseDto(section,
							getCabinetInfoBundle(cabinetIds));
				})
				.collect(Collectors.toList());
	}


	/**
	 * {@inheritDoc}
	 */
	@Override
	public CabinetPaginationDto getCabinetPaginationByLentType(LentType lentType, Integer page,
			Integer size) {
		logger.info("getCabinetPaginationByLentType");
		if (size <= 0) {
			size = Integer.MAX_VALUE;
		}
		PageRequest pageable = PageRequest.of(page, size);
		Page<Cabinet> cabinets = cabinetOptionalFetcher.findPaginationByLentType(lentType,
				pageable);
		List<CabinetDto> cabinetDtos = cabinets.toList().stream()
				.map((cabinet) -> cabinetMapper.toCabinetDto(cabinet))
				.collect(Collectors.toList());
		return cabinetMapper.toCabinetPaginationDtoList(cabinetDtos,
				cabinets.getTotalPages());
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public CabinetPaginationDto getCabinetPaginationByStatus(CabinetStatus status, Integer page,
			Integer size) {
		logger.info("getCabinetPaginationByStatus");
		if (size <= 0) {
			size = Integer.MAX_VALUE;
		}
		PageRequest pageable = PageRequest.of(page, size);
		Page<Cabinet> cabinets = cabinetOptionalFetcher.findPaginationByStatus(status, pageable);
		List<CabinetDto> cabinetDtos = cabinets.toList().stream()
				.map((cabinet) -> cabinetMapper.toCabinetDto(cabinet))
				.collect(Collectors.toList());
		return cabinetMapper.toCabinetPaginationDtoList(cabinetDtos,
				cabinets.getTotalPages());
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public CabinetPaginationDto getCabinetPaginationByVisibleNum(Integer visibleNum, Integer page,
			Integer size) {
		logger.info("getCabinetPaginationByVisibleNum");
		if (size <= 0) {
			size = Integer.MAX_VALUE;
		}
		PageRequest pageable = PageRequest.of(page, size);
		Page<Cabinet> cabinets = cabinetOptionalFetcher.findPaginationByVisibleNum(visibleNum,
				pageable);
		List<CabinetDto> cabinetDtos = cabinets.toList().stream()
				.map((cabinet) -> cabinetMapper.toCabinetDto(cabinet))
				.collect(Collectors.toList());
		return cabinetMapper.toCabinetPaginationDtoList(cabinetDtos,
				cabinets.getTotalPages());
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public LentHistoryPaginationDto getCabinetLentHistoriesPagination(Long cabinetId, Integer page,
			Integer size) {
		logger.info("getCabinetLentHistoriesPagination");
		if (size <= 0) {
			size = Integer.MAX_VALUE;
		}
		PageRequest pageable = PageRequest.of(page, size);
		Page<LentHistory> lentHistories = lentOptionalFetcher.findPaginationByCabinetId(cabinetId,
				pageable);
		return lentMapper.toLentHistoryPaginationDto(
				generateLentHistoryDtoList(lentHistories.toList()), lentHistories.getTotalPages());
	}

	/**
	 * 사물함들의 정보와 각각의 대여 정보들을 가져옵니다.
	 *
	 * @param cabinetIds 사물함 id 리스트
	 * @return 사물함 정보 리스트
	 */
	public List<CabinetInfoResponseDto> getCabinetInfoBundle(List<Long> cabinetIds) {
		logger.info("getCabinetInfoBundle");
		List<CabinetInfoResponseDto> result = new ArrayList<>();
		for (Long cabinetId : cabinetIds) {
			result.add(getCabinetInfo(cabinetId));
		}
		return result;
	}

	@Override
	public CabinetInfoPaginationDto getCabinetsInfo(Integer visibleNum) {
		logger.info("getCabinetsInfo");
		PageRequest page = PageRequest.of(0, Integer.MAX_VALUE);
		Page<Cabinet> allCabinetsByVisibleNum = cabinetOptionalFetcher.findPaginationByVisibleNum(
				visibleNum, page);
		List<Long> collect = allCabinetsByVisibleNum.map(cabinet -> cabinet.getCabinetId())
				.stream().collect(Collectors.toList());
		return new CabinetInfoPaginationDto(getCabinetInfoBundle(collect),
				allCabinetsByVisibleNum.getTotalPages());
	}

	/**
	 * LentHistory를 이용해 LentHistoryDto로 매핑하여 반환합니다.
	 * ToDo : new -> mapper 쓰기 + query service 분리
	 *
	 * @param lentHistories 대여 기록 리스트
	 * @return LentHistoryDto 리스트
	 */
	private List<LentHistoryDto> generateLentHistoryDtoList(
			List<LentHistory> lentHistories) {
		logger.info("generateLentHistoryDtoList");
		return lentHistories.stream()
				.map(e -> lentMapper.toLentHistoryDto(e,
						userOptionalFetcher.findUser(e.getUserId()),
						cabinetOptionalFetcher.findCabinet(e.getCabinetId())))
				.collect(Collectors.toList());
	}

	/*--------------------------------------------CUD--------------------------------------------*/

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
	public void updateCabinetBundleStatus(UpdateCabinetsRequestDto updateCabinetsRequestDto,
			CabinetStatus status) {
		for (Long cabinetId : updateCabinetsRequestDto.getCabinetIds()) {
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
}
