package org.ftclub.cabinet.lent.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.dto.*;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.user.domain.UserSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lent-histories")
public class LentController {

	private final LentFacadeService lentFacadeService;

	@PostMapping("/api/lent-histories/cabinets/{cabinetId}")
	public void startLentCabinet(
			@UserSession UserSessionDto user,
			Long cabinetId) {
		lentFacadeService.startLentCabinet(user.getUserId(), cabinetId);
	}
/*
	  /api/lent/return-memo

 */

	@PatchMapping("/return")
	public void endLent(
			@UserSession UserSessionDto userSessionDto) {
		lentFacadeService.endLentCabinet(userSessionDto);
	}

	@PatchMapping("/return-memo")
	public void endLentWithMemo(
			@UserSession UserSessionDto userSessionDto,
			@RequestBody LentEndMemoDto lentEndMemoDto)
	{
		lentFacadeService.endLentCabinetWithMemo(userSessionDto, lentEndMemoDto);
	}

	@PatchMapping("me/memo")
	public void updateCabinetMemo(
			@UserSession UserSessionDto user,
			@RequestBody UpdateCabinetMemoDto updateCabinetMemoDto) {
				lentFacadeService.updateCabinetMemo(user, updateCabinetMemoDto);
	}

	@PatchMapping("me/cabinet-title")
	public void updateCabinetTitle(
			@UserSession UserSessionDto user,
			@RequestBody UpdateCabinetTitleDto updateCabinetTitleDto) {
				lentFacadeService.updateCabinetTitle(user, updateCabinetTitleDto);
	}



	@GetMapping("users/me")
	public MyCabinetInfoResponseDto getMyLentInfo(
			@UserSession UserSessionDto user) {
		return lentFacadeService.getMyLentInfo(user);
	}

	@GetMapping("users/me/log")
	public LentHistoryPaginationDto getMyLentLog(
			@UserSession UserSessionDto user,
			@RequestBody PaginationRequestDto pagination) {
		return lentFacadeService.getMyLentLog(user, pagination);
	}

	/**
	 * wchae, jpark2

	 * sanan, daewoole
	 * /api/my_lent_info/log
	 * /api/my_lent_info
	 */
}