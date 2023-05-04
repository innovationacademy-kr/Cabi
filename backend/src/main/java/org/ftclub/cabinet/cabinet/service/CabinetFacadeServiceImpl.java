package org.ftclub.cabinet.cabinet.service;

import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.BuildingFloorsResponseDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.service.LentService;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.LentMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CabinetFacadeServiceImpl implements CabinetFacadeService {

	private final CabinetService cabinetService;
	private final LentService lentService;
	private final
	private final CabinetMapper cabinetMapper;
	private final LentMapper lentMapper;

	public CabinetDto getCabinet(Long cabinetId) {
		Cabinet cabinet = cabinetService.getCabinet(cabinetId);
		Location location = cabinetService.getLocationByCabinetId(cabinetId);
		return cabinetMapper.toCabinetDto(location, cabinet);
	}

	public BuildingFloorsResponseDto getBuildingFloorsResponse() {
		List<BuildingFloorsDto> buildingFloors = new ArrayList<>();
		List<String> buildings = cabinetService.getAllBuildings();
		for (String building : buildings) {
			List<Integer> floors = cabinetService.getAllFloorsByBuilding(building);
			buildingFloors.add(cabinetMapper.toBuildingFloorsDto(building, floors));
		}
		return cabinetMapper.toBuildingFloorsResponseDto(buildingFloors);
	}


	// 단순 값 참조이므로(서비스 로직이나 도메인 로직이 필요하지 않으므로) repository를 호출한다.
	public CabinetInfoResponseDto getCabinetInfo(Long cabinetId) {
		List<LentDto> lentDtos = new ArrayList<>();
		List<LentHistory> lentHistories = lentService.findAllActiveLentByCabinetId(cabinetId);
		for (LentHistory lentHistory : lentHistories) {
			String name = userRepository.findNameById(lentHistory.getUserId());
			lentDtos.add(lentMapper.toLentDto(name, lentHistory));
		}
		return cabinetMapper.toCabinetInfoResponseDto(getCabinet(cabinetId), lentDtos);
	}

	public List<CabinetsPerSectionResponseDto> getCabinetsPerSection(String building,
			Integer floor) {
		List<CabinetsPerSectionResponseDto> result = new ArrayList<>();
		List<String> sections = cabinetRepository.findAllSectionsByBuildingAndFloor(building,
				floor).orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_USER));
		return null;
	}


}
