package org.ftclub.cabinet.cabinet.controller;

import java.util.HashMap;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.AuthGuard;
import org.ftclub.cabinet.auth.AuthGuard.Level;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeService;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 일반 사용자가 사물함 서비스를 사용하기 위한 컨트롤러입니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cabinets")
public class CabinetController {

	private final CabinetFacadeService cabinetFacadeService;

	/**
	 * 모든 건물과 층에 대한 정보를 가져옵니다.
	 *
	 * @return 모든 건물과 층에 대한 정보를 반환합니다.
	 */
	@GetMapping("/buildings/floors")
	@AuthGuard(level = Level.USER_OR_ADMIN)
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
	@AuthGuard(level = Level.USER_OR_ADMIN)
	public List<CabinetsPerSectionResponseDto> getCabinetsPerSection(
			@PathVariable("building") String building,
			@PathVariable("floor") Integer floor) {
		if (building == null || floor == null) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
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
	@AuthGuard(level = Level.USER_OR_ADMIN)
	public CabinetDto getCabinetInfo(
			@PathVariable("cabinetId") Long cabinetId) {
		if (cabinetId == null) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		return cabinetFacadeService.getCabinetInfo(cabinetId);
	}

	/**
	 * 사물함의 제목을 변경합니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @param body      변경할 제목
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@PatchMapping(value = "/{cabinetId}/title")
	@AuthGuard(level = Level.USER_ONLY)
	public void updateCabinetTitle(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody HashMap<String, String> body) {
		if (cabinetId == null || body == null || body.isEmpty() || !body.containsKey("title")) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetTitle(cabinetId, body.get("title"));
	}

	/**
	 * 사물함의 메모를 변경합니다.
	 *
	 * @param cabinetId 사물함 ID
	 * @param body      변경할 메모
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@PatchMapping("/{cabinetId}/memo")
	@AuthGuard(level = Level.USER_ONLY)
	public void updateCabinetMemo(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody HashMap<String, String> body) {
		if (cabinetId == null || body == null || body.isEmpty() || !body.containsKey("memo")) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetMemo(cabinetId, body.get("memo"));
	}
}
