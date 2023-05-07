package org.ftclub.cabinet.cabinet.controller;

import java.util.HashMap;
import java.util.List;
import lombok.RequiredArgsConstructor;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cabinets")
public class CabinetController {

	private final CabinetFacadeService cabinetFacadeService;

	@GetMapping("/buildings/floors")
	public List<BuildingFloorsDto> getBuildingFloorsResponse() {
		return cabinetFacadeService.getBuildingFloorsResponse();
	}

	@GetMapping("/buildings/{building}/floors/{floor}")
	public List<CabinetsPerSectionResponseDto> getCabinetsPerSection(
			@PathVariable("building") String building,
			@PathVariable("floor") Integer floor) {
		if (building == null || floor == null) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		return cabinetFacadeService.getCabinetsPerSection(building, floor);
	}

	@GetMapping("/{cabinetId}")
	public CabinetDto getCabinetInfo(
			@PathVariable("cabinetId") Long cabinetId) {
		if (cabinetId == null) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		return cabinetFacadeService.getCabinetInfo(cabinetId);
	}

	@PatchMapping(value = "/{cabinetId}/title")
	public void updateCabinetTitle(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody HashMap<String, String> body) {
		if (cabinetId == null || body == null || body.isEmpty() || !body.containsKey("title")) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetTitle(cabinetId, body.get("title"));
	}

	@PatchMapping("/{cabinetId}/memo")
	public void updateCabinetMemo(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody HashMap<String, String> body) {
		if (cabinetId == null || body == null || body.isEmpty() || !body.containsKey("memo")) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetMemo(cabinetId, body.get("memo"));
	}
}
