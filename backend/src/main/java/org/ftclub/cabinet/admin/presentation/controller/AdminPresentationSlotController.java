package org.ftclub.cabinet.admin.presentation.controller;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminPresentationSlotRequestDto;
import org.ftclub.cabinet.admin.dto.PresentationSlotRegisterServiceDto;
import org.ftclub.cabinet.admin.presentation.service.AdminPresentationSlotService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/v6/admin/presentations")
@RequiredArgsConstructor
public class AdminPresentationSlotController {

	private final AdminPresentationSlotService adminPresentationSlotService;

	/**
	 * 프레젠테이션 슬롯을 등록합니다.
	 *
	 * @param slotRequestDto 프레젠테이션 슬롯 등록 요청 DTO
	 */
	@PostMapping("/slots")
	public void registerPresentationSlot(
			@RequestBody @Valid AdminPresentationSlotRequestDto slotRequestDto) {
		adminPresentationSlotService.registerPresentationSlot(
				new PresentationSlotRegisterServiceDto(
						slotRequestDto.getStartTime(),
						slotRequestDto.getLocation()
				));
	}
}
