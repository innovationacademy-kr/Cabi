package org.ftclub.cabinet.lent.controller;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.CabinetInfoRequestDto;
import org.ftclub.cabinet.dto.LentEndMemoDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetResponseDto;
import org.ftclub.cabinet.dto.UpdateCabinetMemoDto;
import org.ftclub.cabinet.dto.UpdateCabinetTitleDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.user.domain.UserSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/lent")
@Log4j2
public class LentController {

	private final LentFacadeService lentFacadeService;

	@PostMapping("/cabinets/{cabinetId}")
	public void startLentCabinet(
			@UserSession UserSessionDto user,
			@PathVariable Long cabinetId) {
		log.info("Called startLentCabinet user: {}, cabinetId: {}", user, cabinetId);
		lentFacadeService.startLentCabinet(user.getUserId(), cabinetId);
	}

	@PostMapping("/cabinets/share/{cabinetId}")
	public void startLentShareCabinet(
			@UserSession UserSessionDto user,
			@PathVariable Long cabinetId,
			@Valid @RequestBody Integer shareCode) {
		log.info("Called startLentShareCabinet user: {}, cabinetId: {}", user, cabinetId);
		lentFacadeService.startLentShareCabinet(user.getUserId(), cabinetId, shareCode);
	}

	@PatchMapping("/return")
	public void endLent(
			@UserSession UserSessionDto userSessionDto) {
		log.info("Called endLent user: {}", userSessionDto);
		lentFacadeService.endLentCabinet(userSessionDto);
	}

	@PatchMapping("/return-memo")
	public void endLentWithMemo(
			@UserSession UserSessionDto userSessionDto,
			@Valid @RequestBody LentEndMemoDto lentEndMemoDto) {
		log.info("Called endLentWithMemo user: {}, lentEndMemoDto: {}", userSessionDto,
				lentEndMemoDto);
		lentFacadeService.endLentCabinetWithMemo(userSessionDto, lentEndMemoDto);
	}

	@PatchMapping("/me/memo")
	public void updateCabinetMemo(
			@UserSession UserSessionDto user,
			@Valid @RequestBody UpdateCabinetMemoDto updateCabinetMemoDto) {
		log.info("Called updateCabinetMemo user: {}, updateCabinetMemoDto: {}", user,
				updateCabinetMemoDto);
		lentFacadeService.updateCabinetMemo(user, updateCabinetMemoDto);
	}

	@PatchMapping("/me/cabinet-title")
	public void updateCabinetTitle(
			@UserSession UserSessionDto user,
			@Valid @RequestBody UpdateCabinetTitleDto updateCabinetTitleDto) {
		log.info("Called updateCabinetTitle user: {}, updateCabinetTitleDto: {}", user,
				updateCabinetTitleDto);
		lentFacadeService.updateCabinetTitle(user, updateCabinetTitleDto);
	}

	@PatchMapping("/me/cabinet")
	public void updateCabinetInfo(
			@UserSession UserSessionDto user,
			@RequestBody CabinetInfoRequestDto cabinetInfoRequestDto) {
		log.info("Called updateCabinetInfo user: {}, cabinetInfoRequestDto: {}", user,
				cabinetInfoRequestDto);
		lentFacadeService.updateCabinetInfo(user, cabinetInfoRequestDto);
	}

	@GetMapping("/me")
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
	public LentHistoryPaginationDto getMyLentLog(
			@UserSession UserSessionDto user,
			@RequestParam("page") Integer page,
			@RequestParam("size") Integer size) {
		log.info("Called getMyLentLog user: {}, page: {}, size: {}", user, page, size);
		return lentFacadeService.getMyLentLog(user, page, size);
	}
}
