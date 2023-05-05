package org.ftclub.cabinet.cabinet.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeService;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.CabinetsPerSectionResponseDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
			@RequestParam("building") String building,
			@RequestParam("floor") Integer floor) {
		return cabinetFacadeService.getCabinetsPerSection(building, floor);
	}

	@GetMapping("/{cabinetId}")
	public CabinetDto getCabinetInfo(
			@RequestParam("cabinetId") Long cabinetId) {
		return cabinetFacadeService.getCabinetInfo(cabinetId);
	}

	@PatchMapping("/{cabinetId}/title")
	public void updateCabinetTitle(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody String title) {
		cabinetFacadeService.updateCabinetTitle(cabinetId, title);
	}

	@PatchMapping("/{cabinetId}/memo")
	public void updateCabinetMemo(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody String memo) {
		cabinetFacadeService.updateCabinetMemo(cabinetId, memo);
	}
}
