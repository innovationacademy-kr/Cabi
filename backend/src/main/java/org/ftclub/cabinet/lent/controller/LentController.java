package org.ftclub.cabinet.lent.controller;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.CabinetInfoRequestDto;
import org.ftclub.cabinet.dto.LentEndMemoDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetResponseDto;
import org.ftclub.cabinet.dto.ShareCodeDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.lent.service.LentFacadeService;
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
@Log4j2
public class LentController {

	private final LentFacadeService lentFacadeService;

	@PostMapping("/cabinets/{cabinetId}")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void startLentCabinet(
			@UserSession UserSessionDto user,
			@PathVariable Long cabinetId) {
		log.info("Called startLentCabinet user: {}, cabinetId: {}", user, cabinetId);
		lentFacadeService.startLentCabinet(user.getUserId(), cabinetId);
	}

	@PostMapping("/cabinets/share/{cabinetId}")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void startLentShareCabinet(
			@UserSession UserSessionDto user,
			@PathVariable Long cabinetId,
			@Valid @RequestBody ShareCodeDto shareCodeDto) {
		log.info("Called startLentShareCabinet user: {}, cabinetId: {}", user, cabinetId);
		lentFacadeService.startLentShareCabinet(user.getUserId(), cabinetId,
				shareCodeDto.getShareCode());
	}

	@PatchMapping("/cabinets/share/cancel/{cabinetId}")
	@AuthGuard(level = AuthLevel.USER_OR_ADMIN)
	public void cancelLentShareCabinet(
			@UserSession UserSessionDto user,
			@PathVariable Long cabinetId) {
		log.info("Called cancelLentShareCabinet user: {}, cabinetId: {}", user, cabinetId);
		lentFacadeService.cancelShareCabinetLent(user.getUserId(), cabinetId);
	}

	@PatchMapping("/return")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void endLent(
			@UserSession UserSessionDto userSessionDto) {
		log.info("Called endLent user: {}", userSessionDto);
		lentFacadeService.endUserLent(userSessionDto.getUserId(), null);
	}

	@PatchMapping("/return-memo")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void endLentWithMemo(
			@UserSession UserSessionDto userSessionDto,
			@Valid @RequestBody LentEndMemoDto lentEndMemoDto) {
		log.info("Called endLentWithMemo user: {}, lentEndMemoDto: {}",
				userSessionDto, lentEndMemoDto);
		lentFacadeService.endUserLent(userSessionDto.getUserId(), lentEndMemoDto.getCabinetMemo());
	}

	@PatchMapping("/me/cabinet")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void updateCabinetInfo(
			@UserSession UserSessionDto user,
			@RequestBody CabinetInfoRequestDto cabinetInfoRequestDto) {
		log.info("Called updateCabinetInfo user: {}, cabinetInfoRequestDto: {}", user,
				cabinetInfoRequestDto);
		lentFacadeService.updateLentCabinetInfo(user.getUserId(),
				cabinetInfoRequestDto.getTitle(), cabinetInfoRequestDto.getMemo());
	}

	@GetMapping("/me")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public ResponseEntity<MyCabinetResponseDto> getMyLentInfo(
			@UserSession UserSessionDto user) {
		log.info("Called getMyLentInfo user: {}", user);
		MyCabinetResponseDto myCabinetResponseDto = lentFacadeService.getMyLentInfo(user);
		if (myCabinetResponseDto == null) {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		}
		return ResponseEntity.status(HttpStatus.OK).body(myCabinetResponseDto);
	}

	@GetMapping("/me/histories")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public LentHistoryPaginationDto getMyLentLog(
			@UserSession UserSessionDto user, @Valid Pageable pageable) {
		log.info("Called getMyLentLog user: {}, pageable: {}", user, pageable);
		return lentFacadeService.getMyLentLog(user, pageable);
	}
}
