package org.ftclub.cabinet.cqrs.service;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cqrs.respository.CqrsRedis;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetAvailableResponseDto;
import org.ftclub.cabinet.dto.CabinetPreviewDto;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.springframework.stereotype.Service;

@Service
@Logging(level = LogLevel.DEBUG)
@RequiredArgsConstructor
public class CqrsService {

	private final CqrsRedis cqrsRedis;

	private final CabinetMapper cabinetMapper;


	public void clearBuildingFloors() {
		cqrsRedis.clearBuildingFloors();
	}

	public List<BuildingFloorsDto> getBuildingFloors() {
		return cqrsRedis.getBuildingFloors();
	}

	public void addBuildingFloors(String building, List<Integer> floors) {
		List<BuildingFloorsDto> buildingFloorsDtos = cqrsRedis.getBuildingFloors();
		buildingFloorsDtos.add(cabinetMapper.toBuildingFloorsDto(building, floors));
		cqrsRedis.setBuildingFloors(buildingFloorsDtos);
	}

	public void clearFloors() {
		cqrsRedis.clearFloors();
	}

	public List<Integer> getFloors(String building) {
		return cqrsRedis.getFloors(building);
	}

	public void addFloors(String building, List<Integer> floors) {
		cqrsRedis.setFloors(building, floors);
	}

	public void clearAvailableCabinet() {
		cqrsRedis.clearAvailableCabinet();
	}

	public CabinetAvailableResponseDto getAvailableCabinet(String building) {
		Map<Integer, List<CabinetPreviewDto>> availableCabinet =
				cqrsRedis.getAvailableCabinet(building);
		return cabinetMapper.toCabinetAvailableResponseDto(availableCabinet);
	}

	public void addAvailableCabinet(Cabinet cabinet) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String building = location.getBuilding();
		Integer floor = location.getFloor();
		System.out.println("cabinet = " + cabinet);
		List<CabinetPreviewDto> availableCabinets = cqrsRedis.getAvailableCabinet(building, floor);
		availableCabinets.add(cabinetMapper.toCabinetPreviewDto(cabinet, 0, null));
		System.out.println("availableCabinets.size() = " + availableCabinets.size());
		System.out.println("availableCabinets = " + availableCabinets);
		cqrsRedis.setAvailableCabinet(building, floor, availableCabinets);
	}

	public void removeAvailableCabinet(Cabinet cabinet) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String building = location.getBuilding();
		Integer floor = location.getFloor();
		List<CabinetPreviewDto> availableCabinets = cqrsRedis.getAvailableCabinet(building, floor);
		availableCabinets.removeIf(c -> c.getCabinetId().equals(cabinet.getId()));
		cqrsRedis.setAvailableCabinet(building, floor, availableCabinets);
	}

	public void clearCabinetPerSection() {
		cqrsRedis.clearCabinetPerSection();
	}
}
