package org.ftclub.cabinet.cabinet.newService;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
public class CabinetFacadeService {

	private final CabinetCommandService cabinetCommandService;
	private final CabinetQueryService cabinetQueryService;
	private final CabinetMapper cabinetMapper;

	/**
	 * {@inheritDoc}
	 * <p>
	 * 존재하는 모든 건물들을 가져오고, 각 건물별 층 정보들을 가져옵니다.
	 */
	@Transactional(readOnly = true)
	public List<BuildingFloorsDto> getBuildingFloorsResponse() {
		log.debug("getBuildingFloorsResponse");
		List<String> allBuildings = cabinetQueryService.getAllBuildings();
		return allBuildings.stream()
				.map(building -> cabinetMapper.toBuildingFloorsDto(building,
						cabinetQueryService.getAllFloorsByBuilding(building))
				)
				.collect(Collectors.toList());
	}

	/**
	 * {@inheritDoc} 사물함 id로 사물함 정보를 가져옵니다.
	 */
	public CabinetInfoResponseDto getCabinetInfoResponse(Long cabinetId) {
		log.debug("getCabinetInfoResponse: {}", cabinetId);

		return null;
	}


}
