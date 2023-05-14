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

/**
 * 관리자가 사물함을 관리할 때 사용하는 컨트롤러입니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/cabinets")
public class AdminCabinetController {

	private final CabinetFacadeService cabinetFacadeService;

	/**
	 * 사물함의 정보와 그 사물함의 대여 정보들을 가져옵니다.
	 *
	 * @param cabinetId 사물함 아이디
	 * @return 사물함 정보와 그 사물함의 대여 정보를 반환합니다.
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@GetMapping("/{cabinetId}")
	@AuthGuard(level = Level.ADMIN_ONLY)
	public CabinetInfoResponseDto getCabinetInfo(
			@PathVariable("cabinetId") Long cabinetId) {
		if (cabinetId == null) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		return cabinetFacadeService.getCabinetInfo(cabinetId);
	}

	/**
	 * 사물함의 상태를 업데이트합니다.
	 *
	 * @param cabinetId 사물함 아이디
	 * @param status    변경할 사물함 상태
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@PatchMapping("/{cabinetId}/status/{status}")
	@AuthGuard(level = Level.ADMIN_ONLY)
	public void updateCabinetStatus(
			@PathVariable("cabinetId") Long cabinetId,
			@PathVariable("status") CabinetStatus status) {
		if (cabinetId == null || status == null) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetStatus(cabinetId, status);
	}

	/**
	 * 사물함의 대여 타입을 업데이트합니다.
	 *
	 * @param cabinetId 사물함 아이디
	 * @param lentType  변경할 사물함 대여 타입
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@PatchMapping("/{cabinetId}/lent-types/{lentType}")
	@AuthGuard(level = Level.ADMIN_ONLY)
	public void updateCabinetLentType(
			@PathVariable("cabinetId") Long cabinetId,
			@PathVariable("lentType") LentType lentType) {
		if (cabinetId == null || lentType == null) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetLentType(cabinetId, lentType);
	}

	/**
	 * 사물함의 고장 사유를 업데이트합니다.
	 *
	 * @param cabinetId 사물함 아이디
	 * @param body      { statusNote: 변경할 사물함 상태 메모 }
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@PatchMapping("/{cabinetId}/status-note")
	@AuthGuard(level = Level.ADMIN_ONLY)
	public void updateCabinetStatusNote(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody HashMap<String, String> body) {
		if (cabinetId == null || body == null || body.isEmpty() || !body.containsKey(
				"statusNote")) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetStatusNote(cabinetId, body.get("statusNote"));
	}

	/**
	 * 사물함의 제목을 업데이트합니다.
	 *
	 * @param cabinetId 사물함 아이디
	 * @param body      { title: 변경할 사물함 제목 }
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@PatchMapping("/{cabinetId}/title")
	@AuthGuard(level = Level.ADMIN_ONLY)
	public void updateCabinetTitle(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody HashMap<String, String> body) {
		if (cabinetId == null || body == null || body.isEmpty() || !body.containsKey("title")) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetTitle(cabinetId, body.get("title"));
	}

	/**
	 * 사물함의 행과 열을 업데이트합니다.
	 *
	 * @param cabinetId 사물함 아이디
	 * @param body      { row: 변경할 사물함 행, col: 변경할 사물함 열 }
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@PatchMapping("/{cabinetId}/grid")
	@AuthGuard(level = Level.ADMIN_ONLY)
	public void updateCabinetGrid(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody Map<String, Integer> body) {

		if (cabinetId == null || body == null || body.isEmpty() || !body.containsKey("row")
				|| !body.containsKey("col")) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetGrid(cabinetId, body.get("row"), body.get("col"));
	}

	/**
	 * 사물함의 표시 번호를 업데이트합니다.
	 *
	 * @param cabinetId 사물함 아이디
	 * @param body      { visibleNum: 변경할 사물함 표시 번호 }
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@PatchMapping("/{cabinetId}/visible-num")
	@AuthGuard(level = Level.ADMIN_ONLY)
	public void updateCabinetVisibleNum(
			@PathVariable("cabinetId") Long cabinetId,
			@RequestBody HashMap<String, Integer> body) {
		if (cabinetId == null || body == null || body.isEmpty() || !body.containsKey(
				"visibleNum")) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetVisibleNum(cabinetId, body.get("visibleNum"));
	}

	/**
	 * 사물함들의 상태를 일괄 변경합니다.
	 *
	 * @param body   { 변경할 사물함 아이디 리스트 }
	 * @param status 변경할 사물함 상태
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@PatchMapping("/status/{status}")
	@AuthGuard(level = Level.ADMIN_ONLY)
	public void updateCabinetBundleStatus(
			@RequestBody HashMap<String, List<Long>> body,
			@PathVariable("status") CabinetStatus status) {
		if (body == null || body.isEmpty() || !body.containsKey("cabinetIds") || status == null) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetBundleStatus(body.get("cabinetIds"), status);
	}

	/**
	 * 사물함들의 대여 타입을 일괄 변경합니다.
	 *
	 * @param body     { 변경할 사물함 아이디 리스트 }
	 * @param lentType 변경할 사물함 대여 타입
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@PatchMapping("/lent-types/{lentType}")
	@AuthGuard(level = Level.ADMIN_ONLY)
	public void updateCabinetBundleLentType(
			@RequestBody HashMap<String, List<Long>> body,
			@PathVariable("lentType") LentType lentType) {
		if (body == null || body.isEmpty() || !body.containsKey("cabinetIds") || lentType == null) {
			throw new ControllerException(ExceptionStatus.INCORRECT_ARGUMENT);
		}
		cabinetFacadeService.updateCabinetBundleLentType(body.get("cabinetIds"), lentType);
	}
}
