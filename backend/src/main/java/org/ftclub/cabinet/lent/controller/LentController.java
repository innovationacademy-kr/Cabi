package org.ftclub.cabinet.lent.controller;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.CabinetInfoRequestDto;
import org.ftclub.cabinet.dto.LentEndMemoDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetResponseDto;
import org.ftclub.cabinet.dto.ShareCodeDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.UserSession;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/lent")
@Logging
public class LentController {

	private final LentFacadeService lentFacadeService;

	/**
	 * 개인 사물함 대여 시작
	 *
	 * @param user      사용자 세션
	 * @param cabinetId 대여할 사물함 ID
	 */
	@PostMapping("/cabinets/{cabinetId}")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void startLentCabinet(
			@UserSession UserSessionDto user,
			@PathVariable Long cabinetId) {
		lentFacadeService.startLentCabinet(user.getUserId(), cabinetId);
	}

	/**
	 * 공유 사물함 대여 시작
	 *
	 * @param user         사용자 세션
	 * @param cabinetId    대여할 사물함 ID
	 * @param shareCodeDto 공유 사물함 초대 코드
	 */
	@PostMapping("/cabinets/share/{cabinetId}")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void startLentShareCabinet(
			@UserSession UserSessionDto user,
			@PathVariable Long cabinetId,
			@Valid @RequestBody ShareCodeDto shareCodeDto) {
		lentFacadeService.startLentShareCabinet(user.getUserId(), cabinetId,
				shareCodeDto.getShareCode());
	}

	/**
	 * 공유 사물함 대여 취소
	 *
	 * @param user      사용자 세션
	 * @param cabinetId 대여 취소할 사물함 ID
	 */
	@PatchMapping("/cabinets/share/cancel/{cabinetId}")
	@AuthGuard(level = AuthLevel.USER_OR_ADMIN)
	public void cancelLentShareCabinet(
			@UserSession UserSessionDto user,
			@PathVariable Long cabinetId) {
		lentFacadeService.cancelShareCabinetLent(user.getUserId(), cabinetId);
	}

	/**
	 * 개인 사물함 대여 반납
	 *
	 * @param userSessionDto 사용자 세션
	 */
	@PatchMapping("/return")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void endLent(
			@UserSession UserSessionDto userSessionDto) {
		lentFacadeService.endUserLent(userSessionDto.getUserId(), null);
	}

	/**
	 * 개인 사물함 대여 반납 + 메모
	 * <p>
	 * 3층 사물함 반납 시 사용됨
	 *
	 * @param userSessionDto 사용자 세션
	 * @param lentEndMemoDto 반납 메모
	 */
	@PatchMapping("/return-memo")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void endLentWithMemo(
			@UserSession UserSessionDto userSessionDto,
			@Valid @RequestBody LentEndMemoDto lentEndMemoDto) {
		lentFacadeService.endUserLent(userSessionDto.getUserId(), lentEndMemoDto.getCabinetMemo());
	}

	/**
	 * 개인 사물함 정보 수정
	 * <p>
	 * 사물함 이름, 메모 수정
	 *
	 * @param user                  사용자 세션
	 * @param cabinetInfoRequestDto 수정할 사물함 정보
	 */
	@PatchMapping("/me/cabinet")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void updateCabinetInfo(
			@UserSession UserSessionDto user,
			@Valid @RequestBody CabinetInfoRequestDto cabinetInfoRequestDto) {
		lentFacadeService.updateLentCabinetInfo(user.getUserId(),
				cabinetInfoRequestDto.getTitle(), cabinetInfoRequestDto.getMemo());
	}

	/**
	 * 내 사물함 대여 정보 조회
	 *
	 * @param user 사용자 세션
	 * @return 내 사물함 대여 정보 HTTP 응답
	 */
	@GetMapping("/me")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public ResponseEntity<MyCabinetResponseDto> getMyLentInfo(
			@UserSession UserSessionDto user) {
		MyCabinetResponseDto myCabinetResponseDto = lentFacadeService.getMyLentInfo(user);
		if (myCabinetResponseDto == null) {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		}
		return ResponseEntity.status(HttpStatus.OK).body(myCabinetResponseDto);
	}

	/**
	 * 내 대여 이력 조회
	 *
	 * @param user     사용자 세션
	 * @param pageable 페이지 정보
	 * @return 내 대여 이력
	 */
	@GetMapping("/me/histories")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public LentHistoryPaginationDto getMyLentLog(
			@UserSession UserSessionDto user,
			@Valid Pageable pageable) {
		return lentFacadeService.getMyLentLog(user, pageable);
	}

	/**
	 * 대여중인 사물함에서 새로운 사물함으로 이동
	 *
	 * @param user      사용자 세션
	 * @param cabinetId 이동할 사물함의 ID
	 */
	@PostMapping("/swap/{cabinetId}")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void swap(
			@UserSession UserSessionDto user,
			@PathVariable Long cabinetId) {
		lentFacadeService.swapPrivateCabinet(user.getUserId(), cabinetId);
	}
}
