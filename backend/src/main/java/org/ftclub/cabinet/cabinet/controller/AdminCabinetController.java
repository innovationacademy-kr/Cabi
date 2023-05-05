package org.ftclub.cabinet.cabinet.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.AuthGuard;
import org.ftclub.cabinet.auth.AuthGuard.Level;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeService;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/cabinets")
@AuthGuard(level = Level.ADMIN_ONLY)
public class AdminCabinetController {

	private final CabinetFacadeService cabinetFacadeService;

	@GetMapping("/{cabinetId}")
	public CabinetInfoResponseDto getCabinetInfo(
			@PathVariable("cabinetId") Long cabinetId) {
		return cabinetFacadeService.getCabinetInfo(cabinetId);
	}

	@PatchMapping("/{cabinetId}/status/{status}")
	public void updateCabinetStatus(
			@PathVariable("cabinetId") Long cabinetId,
			@PathVariable("status") CabinetStatus status) {
		cabinetFacadeService.updateCabinetStatus(cabinetId, status);
	}

	@PatchMapping("/{cabinetId}/lent-types/{lentType}")
	public void updateCabinetLentType(
			@PathVariable("cabinetId") Long cabinetId,
			@PathVariable("lentType") LentType lentType) {
		cabinetFacadeService.updateCabinetLentType(cabinetId, lentType);
	}

	@PatchMapping("/{cabinetId}/status-note")
	public void updateCabinetStatusNote(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody String statusNote) {
		cabinetFacadeService.updateCabinetStatusNote(cabinetId, statusNote);
	}

	@PatchMapping("/{cabinetId}/title")
	public void updateCabinetTitle(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody String title) {
		cabinetFacadeService.updateCabinetTitle(cabinetId, title);
	}

	@PatchMapping("/{cabinetId}/grid")
	public void updateCabinetGrid(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody Grid grid) {
		cabinetFacadeService.updateCabinetGrid(cabinetId, grid);
	}

	@PatchMapping("/{cabinetId}/visibleNum")
	public void updateCabinetVisibleNum(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody Integer visibleNum) {
		cabinetFacadeService.updateCabinetVisibleNum(cabinetId, visibleNum);
	}

	@PatchMapping("/status/{status}")
	public void updateCabinetBundleStatus(
			@RequestBody List<Long> cabinetIds,
			@PathVariable("status") CabinetStatus status) {
		cabinetFacadeService.updateCabinetBundleStatus(cabinetIds, status);
	}

	@PatchMapping("/lent-types/{lentType}")
	public void updateCabinetBundleLentType(
			@RequestBody List<Long> cabinetIds,
			@PathVariable("lentType") LentType lentType) {
		cabinetFacadeService.updateCabinetBundleLentType(cabinetIds, lentType);
	}
}
