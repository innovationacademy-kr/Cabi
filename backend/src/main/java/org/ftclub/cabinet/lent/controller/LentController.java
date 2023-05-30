package org.ftclub.cabinet.lent.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.LentEndMemoDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;
import org.ftclub.cabinet.dto.MyCabinetInfoResponseDto;
import org.ftclub.cabinet.dto.UpdateCabinetTitleDto;
import org.ftclub.cabinet.dto.UserSessionDto;
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
	@PatchMapping("/return-memo")
	public void endLentWithMemo(
			@UserSession UserSessionDto user,
			@RequestBody LentEndMemoDto lentEndMemoDto
	{
		lentFacadeService.endLentCabinet(user);
	}





	@PatchMapping("/cabinet-title")
	public void updateCabinetTitle(
			@UserSession UserSessionDto user,
			@RequestBody UpdateCabinetTitleDto updateCabinetTitleDto) {
//				lentFacadeService
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
	 * /api/lent/return
	 * /api/lent/update_cabinet_memo
	 * /api/lent/update_cabinet_title

	 * sanan, daewoole
	 * /api/my_lent_info/log
	 * /api/my_lent_info
	 */
}