package org.ftclub.cabinet.cabinet.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.AuthGuard;
import org.ftclub.cabinet.auth.AuthGuard.Level;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeService;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
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
@RequestMapping("/api/admin/cabinets")
@AuthGuard(level = Level.ADMIN_ONLY)
public class AdminCabinetController {

	private final CabinetFacadeService cabinetFacadeService;

	@GetMapping("/{cabinetId}")
	public CabinetInfoResponseDto getCabinetInfo(
			@PathVariable("cabinetId") Long cabinetId) {
		if (cabinetId == null) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		return cabinetFacadeService.getCabinetInfo(cabinetId);
	}

	@PatchMapping("/{cabinetId}/status/{status}")
	public void updateCabinetStatus(
			@PathVariable("cabinetId") Long cabinetId,
			@PathVariable("status") CabinetStatus status) {
		if (cabinetId == null || status == null) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetStatus(cabinetId, status);
	}

	@PatchMapping("/{cabinetId}/lent-types/{lentType}")
	public void updateCabinetLentType(
			@PathVariable("cabinetId") Long cabinetId,
			@PathVariable("lentType") LentType lentType) {
		if (cabinetId == null || lentType == null) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetLentType(cabinetId, lentType);
	}

	@PatchMapping("/{cabinetId}/status-note")
	public void updateCabinetStatusNote(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody HashMap<String, String> body) {
		if (cabinetId == null || body == null || body.isEmpty() || !body.containsKey(
				"statusNote")) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetStatusNote(cabinetId, body.get("statusNote"));
	}

	@PatchMapping("/{cabinetId}/title")
	public void updateCabinetTitle(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody HashMap<String, String> body) {
		if (cabinetId == null || body == null || body.isEmpty() || !body.containsKey("title")) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetTitle(cabinetId, body.get("title"));
	}

	@PatchMapping("/{cabinetId}/grid")
	public void updateCabinetGrid(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody Map<String, Integer> body) {

		if (cabinetId == null || body == null || body.isEmpty() || !body.containsKey("row")
				|| !body.containsKey("col")) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetGrid(cabinetId, body.get("row"), body.get("col"));
	}

	@PatchMapping("/{cabinetId}/visible-num")
	public void updateCabinetVisibleNum(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody HashMap<String, Integer> body) {
		if (cabinetId == null || body == null || body.isEmpty() || !body.containsKey(
				"visibleNum")) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetVisibleNum(cabinetId, body.get("visibleNum"));
	}

	@PatchMapping("/status/{status}")
	public void updateCabinetBundleStatus(
			@RequestBody HashMap<String, List<Long>> body,
			@PathVariable("status") CabinetStatus status) {
		if (body == null || body.isEmpty() || !body.containsKey("cabinetIds") || status == null) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetBundleStatus(body.get("cabinetIds"), status);
	}

	@PatchMapping("/lent-types/{lentType}")
	public void updateCabinetBundleLentType(
			@RequestBody HashMap<String, List<Long>> body,
			@PathVariable("lentType") LentType lentType) {
		if (body == null || body.isEmpty() || !body.containsKey("cabinetIds") || lentType == null) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetBundleLentType(body.get("cabinetIds"), lentType);
	}
}
