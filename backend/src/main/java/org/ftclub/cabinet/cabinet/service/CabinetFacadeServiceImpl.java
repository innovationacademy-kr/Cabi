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
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.repository.UserRepository;
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


	@Override
	public void updateCabinetStatus(Long cabinetId, CabinetStatus status) {
		cabinetService.updateStatus(cabinetId, status);
	}

	@Override
	public void updateCabinetLentType(Long cabinetId, LentType lentType) {
		cabinetService.updateLentType(cabinetId, lentType);
	}

	@Override
	public void updateCabinetStatusNote(Long cabinetId, String statusNote) {
		cabinetService.updateStatusNote(cabinetId, statusNote);
	}

	@Override
	public void updateCabinetTitle(Long cabinetId, String title) {
		cabinetService.updateTitle(cabinetId, title);
	}

	@Override
	public void updateCabinetMemo(Long cabinetId, String memo) {
		cabinetService.updateMemo(cabinetId, memo);
	}

	@Override
	public void updateCabinetGrid(Long cabinetId, Integer row, Integer col) {
		cabinetService.updateGrid(cabinetId, new Grid(row, col));
	}

	@Override
	public void updateCabinetVisibleNum(Long cabinetId, Integer visibleNum) {
		cabinetService.updateVisibleNum(cabinetId, visibleNum);
	}

	@Override
	public void updateCabinetBundleStatus(List<Long> cabinetIds, CabinetStatus status) {
		for (Long cabinetId : cabinetIds) {
			cabinetService.updateStatus(cabinetId, status);
		}
	}

	@Override
	public void updateCabinetBundleLentType(List<Long> cabinetIds, LentType lentType) {
		for (Long cabinetId : cabinetIds) {
			cabinetService.updateLentType(cabinetId, lentType);
		}
	}

	public CabinetDto getCabinet(Long cabinetId) {
		Cabinet cabinet = cabinetRepository.findById(cabinetId).orElseThrow();
		Location location = cabinetRepository.findLocationById(cabinetId).orElseThrow();
		return cabinetMapper.toCabinetDto(location, cabinet);
	}

	public List<CabinetInfoResponseDto> getCabinetInfoBundle(List<Long> cabinetIds) {
		List<CabinetInfoResponseDto> result = new ArrayList<>();
		for (Long cabinetId : cabinetIds) {
			result.add(getCabinetInfo(cabinetId));
		}
		return result;
	}
}
