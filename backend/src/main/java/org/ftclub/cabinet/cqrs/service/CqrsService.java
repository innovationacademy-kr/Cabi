package org.ftclub.cabinet.cqrs.service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
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

	public void clearAvailableCabinet() {
		cqrsRedis.clearAvailableCabinet();
	}

	public void clearCabinetPerSection() {
		cqrsRedis.clearCabinetPerSection();
	}

	public void addBuildingFloors(String building, List<Integer> floors) {
		List<BuildingFloorsDto> buildingFloorsDtos = cqrsRedis.getBuildingFloors();
		buildingFloorsDtos.add(cabinetMapper.toBuildingFloorsDto(building, floors));
		cqrsRedis.setBuildingFloors(buildingFloorsDtos);
	}

	public List<BuildingFloorsDto> getBuildingFloors() {
		return cqrsRedis.getBuildingFloors();
	}

	public void addAvailableCabinet(Cabinet cabinet) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String floor = location.getFloor().toString();
		List<CabinetPreviewDto> availableCabinets = cqrsRedis.getAvailableCabinet(floor);
		availableCabinets.add(cabinetMapper.toCabinetPreviewDto(cabinet, 0, null));
		cqrsRedis.setAvailableCabinet(floor, availableCabinets);
	}

	public void removeAvailableCabinet(Cabinet cabinet) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String floor = location.getFloor().toString();
		List<CabinetPreviewDto> availableCabinets = cqrsRedis.getAvailableCabinet(floor);
		availableCabinets.removeIf(c -> c.getCabinetId().equals(cabinet.getId()));
		cqrsRedis.setAvailableCabinet(floor, availableCabinets);
	}

	public List<CabinetPreviewDto> getAvailableCabinets(String building, Integer floor) {
		String key = building + floor.toString();
		List<CabinetPreviewDto> availableCabinet = cqrsRedis.getAvailableCabinet(key);
		return availableCabinet.stream()
				.sorted(Comparator.comparing(CabinetPreviewDto::getVisibleNum))
				.collect(Collectors.toList());
	}
}
