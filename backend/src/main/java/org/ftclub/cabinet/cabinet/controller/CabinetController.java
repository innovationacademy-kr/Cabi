package org.ftclub.cabinet.cabinet.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeService;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetPendingResponseDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.log.Logging;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 일반 사용자가 사물함 서비스를 사용하기 위한 컨트롤러입니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/cabinets")
@Logging
public class CabinetController {

	private final CabinetFacadeService cabinetFacadeService;

	/**
	 * 모든 건물과 층에 대한 정보를 가져옵니다.
	 *
	 * @return 모든 건물과 층에 대한 정보를 반환합니다.
	 */
	@GetMapping("/buildings/floors")
	@AuthGuard(level = AuthLevel.USER_OR_ADMIN)
	public List<BuildingFloorsDto> getBuildingFloorsResponse() {
		return cabinetFacadeService.getBuildingFloorsResponse();
	}

	/**
	 * 건물과 층에 해당하는 섹션별 사물함들의 정보를 가져옵니다.
	 *
	 * @param building 건물 이름
	 * @param floor    층
	 * @return 건물과 층에 해당하는 섹션별 사물함 정보를 반환합니다.
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@GetMapping("/buildings/{building}/floors/{floor}")
	@AuthGuard(level = AuthLevel.USER_OR_ADMIN)
	public List<CabinetsPerSectionResponseDto> getCabinetsPerSection(
			@PathVariable("building") String building,
			@PathVariable("floor") Integer floor) {
		return cabinetFacadeService.getCabinetsPerSection(building, floor);
	}

	/**
	 * 사물함의 정보를 가져옵니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @return 사물함의 정보를 반환합니다.
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@GetMapping("/{cabinetId}")
	@AuthGuard(level = AuthLevel.USER_OR_ADMIN)
	public CabinetInfoResponseDto getCabinetInfo(
			@PathVariable("cabinetId") Long cabinetId) {
		return cabinetFacadeService.getCabinetInfo(cabinetId);
	}

	/**
	 * 오픈 예정인 사물함들의 정보를 가져옵니다.
	 *
	 * @return 오픈 예정인 사물함들의 정보를 반환합니다.
	 */
	@GetMapping("/buildings/{building}/available")
	@AuthGuard(level = AuthLevel.USER_OR_ADMIN)
	public CabinetPendingResponseDto getAvailableCabinets(
			@PathVariable("building") String building) {
		return cabinetFacadeService.getAvailableCabinets(building);
	}
}
