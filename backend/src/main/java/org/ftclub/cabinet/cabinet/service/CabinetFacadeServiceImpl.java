package org.ftclub.cabinet.cabinet.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.*;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.dto.*;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class CabinetFacadeServiceImpl implements CabinetFacadeService {

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
	@Transactional(readOnly = true)
	public List<BuildingFloorsDto> getBuildingFloorsResponse() {
		log.info("getBuildingFloorsResponse");
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
	@Transactional(readOnly = true)
	public CabinetInfoResponseDto getCabinetInfo(Long cabinetId) {
		log.info("getCabinetInfo");
		List<LentDto> lentDtos = new ArrayList<>();
		List<LentHistory> lentHistories = lentOptionalFetcher.findAllActiveLentByCabinetId(
				cabinetId);
		for (LentHistory lentHistory : lentHistories) {
			User findUser = lentHistory.getUser();
			lentDtos.add(lentMapper.toLentDto(findUser, lentHistory));
		}
		return cabinetMapper.toCabinetInfoResponseDto(cabinetOptionalFetcher.findCabinet(cabinetId),
				lentDtos);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	@Transactional(readOnly = true)
	public CabinetSimplePaginationDto getCabinetsSimpleInfoByVisibleNum(Integer visibleNum) {
		log.info("getCabinetsSimpleInfoByVisibleNum");
		PageRequest page = PageRequest.of(0, Integer.MAX_VALUE);
		Page<Cabinet> allCabinetsByVisibleNum = cabinetOptionalFetcher.findPaginationByVisibleNum(
				visibleNum, page);
		List<CabinetSimpleDto> cabinetsSimple = allCabinetsByVisibleNum.stream().map(
				cabinetMapper::toCabinetSimpleDto).collect(Collectors.toList());
		return new CabinetSimplePaginationDto(cabinetsSimple,
				allCabinetsByVisibleNum.getTotalElements());
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	@Transactional(readOnly = true)
	public List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building,
	                                                                 Integer floor) {
		log.info("getCabinetsPerSection");
		return cabinetOptionalFetcher.findAllSectionsByBuildingAndFloor(building, floor).stream()
				.map(section -> {
					return cabinetMapper.toCabinetsPerSectionResponseDto(section,
							getCabinetPreviewBundle(Location.of(building, floor, section)));
				})
				.collect(Collectors.toList());
	}

	public List<CabinetsPerSectionResponseDto> getCabinetsPerSection2(String building, Integer floor) {
		List<Location> locations = cabinetOptionalFetcher.findAllLocationsByBuildingAndFloor(building, floor);
		System.out.println("locations = " + locations);
		System.out.println("---------------------------------------------------------");
		cabinetOptionalFetcher.findCabinetsActiveLentHistoriesByBuildingAndFloor(building, floor).stream().forEach(System.out::println);
		return null;
	}

	private List<CabinetPreviewDto> getCabinetPreviewBundle(Location location) {
		List<Cabinet> cabinets = cabinetOptionalFetcher.findAllCabinetsByLocation(location);

		return cabinets.stream().map(cabinet -> {
			List<LentHistory> lentHistories = lentOptionalFetcher.findAllActiveLentByCabinetId(
					cabinet.getCabinetId());
			String lentUserName = null;
			if (!lentHistories.isEmpty() && lentHistories.get(0).getUser() != null) {
				lentUserName = lentHistories.get(0).getUser().getName();
			}
			return cabinetMapper.toCabinetPreviewDto(cabinet, lentHistories.size(), lentUserName);
		}).collect(Collectors.toList());
	}


	/**
	 * {@inheritDoc}
	 */
	@Override
	@Transactional(readOnly = true)
	public CabinetPaginationDto getCabinetPaginationByLentType(LentType lentType, Integer page,
	                                                           Integer size) {
		log.info("getCabinetPaginationByLentType");
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
				cabinets.getTotalElements());
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	@Transactional(readOnly = true)
	public CabinetPaginationDto getCabinetPaginationByStatus(CabinetStatus status, Integer page,
	                                                         Integer size) {
		log.info("getCabinetPaginationByStatus");
		if (size <= 0) {
			size = Integer.MAX_VALUE;
		}
		PageRequest pageable = PageRequest.of(page, size);
		Page<Cabinet> cabinets = cabinetOptionalFetcher.findPaginationByStatus(status, pageable);
		List<CabinetDto> cabinetDtos = cabinets.toList().stream()
				.map((cabinet) -> cabinetMapper.toCabinetDto(cabinet))
				.collect(Collectors.toList());
		return cabinetMapper.toCabinetPaginationDtoList(cabinetDtos,
				cabinets.getTotalElements());
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	@Transactional(readOnly = true)
	public CabinetPaginationDto getCabinetPaginationByVisibleNum(Integer visibleNum, Integer page,
	                                                             Integer size) {
		log.info("getCabinetPaginationByVisibleNum");
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
				cabinets.getTotalElements());
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	@Transactional(readOnly = true)
	public LentHistoryPaginationDto getCabinetLentHistoriesPagination(Long cabinetId, Integer page,
	                                                                  Integer size) {
		log.info("getCabinetLentHistoriesPagination");
		if (size <= 0) {
			size = Integer.MAX_VALUE;
		}
		PageRequest pageable = PageRequest.of(page, size,
				Sort.by(Sort.Direction.DESC, "startedAt"));
		Page<LentHistory> lentHistories = lentOptionalFetcher.findPaginationByCabinetId(cabinetId,
				pageable);
		return lentMapper.toLentHistoryPaginationDto(
				generateLentHistoryDtoList(lentHistories.toList()),
				lentHistories.getTotalElements());
	}

	/**
	 * 사물함들의 정보와 각각의 대여 정보들을 가져옵니다.
	 *
	 * @param cabinetIds 사물함 id 리스트
	 * @return 사물함 정보 리스트
	 */
	@Transactional(readOnly = true)
	public List<CabinetInfoResponseDto> getCabinetInfoBundle(List<Long> cabinetIds) {
		log.info("getCabinetInfoBundle");
		List<CabinetInfoResponseDto> result = new ArrayList<>();
		for (Long cabinetId : cabinetIds) {
			CabinetInfoResponseDto cabinetInfo = getCabinetInfo(cabinetId);
			if (CabinetInfoResponseDto.isValid(cabinetInfo)) {
				result.add(cabinetInfo);
			}
		}
		// Sorting ASC by Cabinet Floor
		Comparator<CabinetInfoResponseDto> floorComparator = Comparator.comparing(
				dto -> dto.getLocation().getFloor());

		Collections.sort(result, floorComparator);
		return result;
	}

	@Override
	@Transactional(readOnly = true)
	public CabinetInfoPaginationDto getCabinetsInfo(Integer visibleNum) {
		log.info("getCabinetsInfo");
		PageRequest page = PageRequest.of(0, Integer.MAX_VALUE);
		Page<Cabinet> allCabinetsByVisibleNum = cabinetOptionalFetcher.findPaginationByVisibleNum(
				visibleNum, page);
		List<Long> collect = allCabinetsByVisibleNum.map(cabinet -> cabinet.getCabinetId())
				.stream().collect(Collectors.toList());
		return new CabinetInfoPaginationDto(getCabinetInfoBundle(collect),
				allCabinetsByVisibleNum.getTotalElements());
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
		log.info("generateLentHistoryDtoList");
		return lentHistories.stream()
				.map(e -> lentMapper.toLentHistoryDto(e,
						e.getUser(),
						e.getCabinet()))
				.collect(Collectors.toList());
	}

	/*--------------------------------------------CUD--------------------------------------------*/

	/**
	 * {@inheritDoc}
	 */
	@Override
	@Transactional
	public void updateCabinetStatusNote(Long cabinetId, String statusNote) {
		cabinetService.updateStatusNote(cabinetId, statusNote);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	@Transactional
	public void updateCabinetTitle(Long cabinetId, String title) {
		cabinetService.updateTitle(cabinetId, title);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	@Transactional
	public void updateCabinetGrid(Long cabinetId, Integer row, Integer col) {
		cabinetService.updateGrid(cabinetId, Grid.of(row, col));
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	@Transactional
	public void updateCabinetVisibleNum(Long cabinetId, Integer visibleNum) {
		cabinetService.updateVisibleNum(cabinetId, visibleNum);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	@Transactional
	public void updateCabinetBundleStatus(CabinetStatusRequestDto cabinetStatusRequestDto) {
		CabinetStatus status = cabinetStatusRequestDto.getStatus();
		LentType lentType = cabinetStatusRequestDto.getLentType();
		for (Long cabinetId : cabinetStatusRequestDto.getCabinetIds()) {
			if (status != null) {
				cabinetService.updateStatus(cabinetId, cabinetStatusRequestDto.getStatus());
			}
			if (lentType != null) {
				cabinetService.updateLentType(cabinetId, cabinetStatusRequestDto.getLentType());
			}
		}
	}

//	/**
//	 * {@inheritDoc}
//	 */
//	@Override
//	public void updateCabinetBundleLentType(List<Long> cabinetIds, LentType lentType) {
//		for (Long cabinetId : cabinetIds) {
//			cabinetService.updateLentType(cabinetId, lentType);
//		}
//	}
}
