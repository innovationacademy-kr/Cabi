package org.ftclub.cabinet.cqrs.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cqrs.respository.CqrsRedis;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
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

	public void addBuildingFloors(String building, List<Integer> floors) {
		List<BuildingFloorsDto> buildingFloorsDtos = cqrsRedis.getBuildingFloors();
		buildingFloorsDtos.add(cabinetMapper.toBuildingFloorsDto(building, floors));
		cqrsRedis.setBuildingFloors(buildingFloorsDtos);
	}

	public List<BuildingFloorsDto> getBuildingFloors() {
		return cqrsRedis.getBuildingFloors();
	}

	public void clearFloors() {
		cqrsRedis.clearFloors();
	}

	public void addFloors(String building, List<Integer> floors) {
		cqrsRedis.setFloors(building, floors);
	}

	public List<Integer> getFloors(String building) {
		return cqrsRedis.getFloors(building);
	}

	public void clearAvailableCabinet() {
		cqrsRedis.clearAvailableCabinet();
	}

	public void addAvailableCabinet(Cabinet cabinet) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String building = location.getBuilding();
		Integer floor = location.getFloor();
		List<CabinetPreviewDto> availableCabinets = cqrsRedis.getAvailableCabinet(building, floor);
		availableCabinets.add(cabinetMapper.toCabinetPreviewDto(cabinet, 0, null));
		cqrsRedis.setAvailableCabinet(floor, availableCabinets);
	}

	public void removeAvailableCabinet(Cabinet cabinet) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String building = location.getBuilding();
		Integer floor = location.getFloor();
		List<CabinetPreviewDto> availableCabinets = cqrsRedis.getAvailableCabinet(building, floor);
		availableCabinets.removeIf(c -> c.getCabinetId().equals(cabinet.getId()));
		cqrsRedis.setAvailableCabinet(floor, availableCabinets);
	}

	public List<CabinetPreviewDto> getAvailableCabinets(String building, Integer floor) {
		return cqrsRedis.getAvailableCabinet(building, floor);
	}

	public void clearCabinetPerSection() {
		cqrsRedis.clearCabinetPerSection();
	}
}
