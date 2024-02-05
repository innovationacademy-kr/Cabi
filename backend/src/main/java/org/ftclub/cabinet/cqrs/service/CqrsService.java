package org.ftclub.cabinet.cqrs.service;

import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.AVAILABLE_CABINET;
import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.BUILDINGS;
import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.CABINET_PER_SECTION;
import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.FLOORS;

import com.fasterxml.jackson.core.type.TypeReference;
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


	//@formatter:off
	public void clearBuildingFloors() {
		cqrsRedis.clearBySuffix(BUILDINGS.getValue());
	}

	public List<BuildingFloorsDto> getBuildingFloors() {
		return cqrsRedis.get(BUILDINGS.getValue(), new TypeReference<List<BuildingFloorsDto>>() {});
	}

	public void addBuildingFloors(String building, List<Integer> floors) {
		String key = building + BUILDINGS.getValue();
		List<BuildingFloorsDto> buildingFloorsDtos =
				cqrsRedis.get(key, new TypeReference<List<BuildingFloorsDto>>() {});
		buildingFloorsDtos.add(cabinetMapper.toBuildingFloorsDto(building, floors));
		cqrsRedis.set(key, buildingFloorsDtos);
	}

	public void clearFloors() {
		cqrsRedis.clearBySuffix(FLOORS.getValue());
	}

	public List<Integer> getFloors(String building) {
		return cqrsRedis.get(building + FLOORS.getValue(), new TypeReference<List<Integer>>() {});
	}

	public void addFloors(String building, List<Integer> floors) {
		cqrsRedis.set(building + FLOORS.getValue(), floors);
	}

	public void clearAvailableCabinet() {
		cqrsRedis.clearBySuffix(AVAILABLE_CABINET.getValue());
	}

	public CabinetAvailableResponseDto getAvailableCabinet(String building) {
		// DTO로 바로 변환하여 받으면, 이후 정렬이나 리스트 값 변경 시 LinkedHashMap ClassCastException 발생
		Map<Integer, List<CabinetPreviewDto>> availableCabinets =
				cqrsRedis.getHashEntries(building + AVAILABLE_CABINET.getValue(),
						new TypeReference<Integer>() {},
						new TypeReference<List<CabinetPreviewDto>>() {});
		return cabinetMapper.toCabinetAvailableResponseDto(availableCabinets);
	}

	public void addAvailableCabinet(Cabinet cabinet) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String key = location.getBuilding() + AVAILABLE_CABINET.getValue();
		String floor = location.getFloor().toString();
		List<CabinetPreviewDto> availableCabinets =
				cqrsRedis.getHash(key, floor, new TypeReference<List<CabinetPreviewDto>>() {});
		availableCabinets.add(cabinetMapper.toCabinetPreviewDto(cabinet, 0, null));
		cqrsRedis.setHash(key, floor, availableCabinets);
	}

	public void removeAvailableCabinet(Cabinet cabinet) {
		Location location = cabinet.getCabinetPlace().getLocation();
		String key = location.getBuilding() + AVAILABLE_CABINET.getValue();
		String floor = location.getFloor().toString();
		List<CabinetPreviewDto> availableCabinets =
				cqrsRedis.getHash(key, floor, new TypeReference<List<CabinetPreviewDto>>() {});
		availableCabinets.removeIf(c -> c.getCabinetId().equals(cabinet.getId()));
		cqrsRedis.setHash(key, floor, availableCabinets);
	}

	public void clearCabinetPerSection() {
		cqrsRedis.clearBySuffix(CABINET_PER_SECTION.getValue());
	}
	//@formatter:on
}
