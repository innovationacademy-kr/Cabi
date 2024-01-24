package org.ftclub.cabinet.admin.cabinet.controller;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminCabinetGridUpdateRequestDto;
import org.ftclub.cabinet.admin.dto.AdminCabinetStatusNoteUpdateRequestDto;
import org.ftclub.cabinet.admin.dto.AdminCabinetTitleUpdateRequestDto;
import org.ftclub.cabinet.admin.dto.AdminCabinetVisibleNumUpdateRequestDto;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.service.CabinetFacadeService;
import org.ftclub.cabinet.dto.CabinetClubStatusRequestDto;
import org.ftclub.cabinet.dto.CabinetInfoResponseDto;
import org.ftclub.cabinet.dto.CabinetPaginationDto;
import org.ftclub.cabinet.dto.CabinetStatusRequestDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.domain.Pageable;
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
@RequestMapping("/v4/admin/cabinets")
@Logging
public class AdminCabinetController {

	private final CabinetFacadeService cabinetFacadeService;
	private final LentFacadeService lentFacadeService;

	/**
	 * 사물함의 정보와 그 사물함의 대여 정보들을 가져옵니다.
	 *
	 * @param cabinetId 사물함 아이디
	 * @return 사물함 정보와 그 사물함의 대여 정보를 반환합니다.
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@GetMapping("/{cabinetId}")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public CabinetInfoResponseDto getCabinetInfo(
			@PathVariable("cabinetId") Long cabinetId) {
		return cabinetFacadeService.getCabinetInfo(cabinetId);
	}

	/**
	 * 사물함의 고장 사유를 업데이트합니다.
	 *
	 * @param cabinetId 사물함 아이디
	 * @param dto       { statusNote: 변경할 사물함 고장 사유 }
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@PatchMapping("/{cabinetId}/status-note")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void updateCabinetStatusNote(
			@PathVariable("cabinetId") Long cabinetId,
			@Valid @RequestBody AdminCabinetStatusNoteUpdateRequestDto dto) {
		cabinetFacadeService.updateCabinetStatusNote(cabinetId, dto.getStatusNote());
	}

	/**
	 * 사물함의 제목을 업데이트합니다.
	 *
	 * @param cabinetId 사물함 아이디
	 * @param dto       { title: 변경할 사물함 제목 }
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@PatchMapping("/{cabinetId}/title")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void updateCabinetTitle(
			@PathVariable("cabinetId") Long cabinetId,
			@Valid @RequestBody AdminCabinetTitleUpdateRequestDto dto) {
		cabinetFacadeService.updateCabinetTitle(cabinetId, dto.getTitle());
	}

	/**
	 * 사물함의 대여 타입을 업데이트합니다.
	 *
	 * @param cabinetStatusRequestDto 사물함 상태 변경 요청 DTO
	 * @throws ControllerException cabinetIds가 null인 경우.
	 */
	@PatchMapping("")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void updateCabinetBundleStatus(
			@Valid @RequestBody CabinetStatusRequestDto cabinetStatusRequestDto) {
		cabinetFacadeService.updateCabinetBundleStatus(cabinetStatusRequestDto.getCabinetIds(),
				cabinetStatusRequestDto.getStatus(), cabinetStatusRequestDto.getLentType());
	}

	/**
	 * 사물함의 대여 타입을 업데이트합니다.
	 *
	 * @param cabinetClubStatusRequestDto 사물함 상태 변경 요청 DTO
	 * @throws ControllerException cabinetIds가 null인 경우.
	 */
	@PatchMapping("/club")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void updateCabinetClubStatus(
			@Valid @RequestBody CabinetClubStatusRequestDto cabinetClubStatusRequestDto) {
		cabinetFacadeService.updateClub(cabinetClubStatusRequestDto);
		lentFacadeService.startLentClubCabinet(cabinetClubStatusRequestDto.getUserId(),
				cabinetClubStatusRequestDto.getCabinetId());
	}


	/**
	 * 사물함의 행과 열을 업데이트합니다.
	 *
	 * @param cabinetId 사물함 아이디
	 * @param dto       { row: 변경할 사물함 행, col: 변경할 사물함 열 }
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@PatchMapping("/{cabinetId}/grid")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void updateCabinetGrid(
			@PathVariable("cabinetId") Long cabinetId,
			@Valid @RequestBody AdminCabinetGridUpdateRequestDto dto) {
		cabinetFacadeService.updateCabinetGrid(cabinetId, dto.getRow(), dto.getCol());
	}

	/**
	 * 사물함의 표시 번호를 업데이트합니다.
	 *
	 * @param cabinetId 사물함 아이디
	 * @param dto       { visibleNum: 변경할 사물함 표시 번호 }
	 * @throws ControllerException 인자가 null이거나 빈 값일 경우 발생시킵니다.
	 */
	@PatchMapping("/{cabinetId}/visible-num")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public void updateCabinetVisibleNum(
			@PathVariable("cabinetId") Long cabinetId,
			@Valid @RequestBody AdminCabinetVisibleNumUpdateRequestDto dto) {
		cabinetFacadeService.updateCabinetVisibleNum(cabinetId, dto.getVisibleNum());
	}

	/**
	 * 사물함 상태에 따른 사물함의 정보를 페이지네이션으로 가져옵니다.
	 *
	 * @param status   사물함 상태
	 * @param pageable 페이지네이션 정보
	 * @return 사물함 정보 페이지네이션
	 */
	@GetMapping("/status/{status}")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public CabinetPaginationDto getCabinetsByStatus(
			@PathVariable("status") CabinetStatus status,
			@Valid Pageable pageable) {
		return cabinetFacadeService.getCabinetPaginationByStatus(status, pageable);
	}

	/**
	 * 사물함의 대여 기록을 페이지네이션으로 가져옵니다.
	 *
	 * @param cabinetId 사물함 아이디
	 * @param pageable  페이지네이션 정보
	 * @return 대여 기록 페이지네이션
	 */
	@GetMapping("/{cabinetId}/lent-histories")
	@AuthGuard(level = AuthLevel.ADMIN_ONLY)
	public LentHistoryPaginationDto getCabinetLentHistories(
			@Valid @PathVariable("cabinetId") Long cabinetId, @Valid Pageable pageable) {
		return cabinetFacadeService.getLentHistoryPagination(cabinetId, pageable);
	}

}
