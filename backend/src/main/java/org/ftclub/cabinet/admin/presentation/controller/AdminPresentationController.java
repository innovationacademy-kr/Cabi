package org.ftclub.cabinet.admin.presentation.controller;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminPresentationSlotRequestDto;
import org.ftclub.cabinet.admin.dto.AdminPresentationSlotServiceDto;
import org.ftclub.cabinet.admin.presentation.service.AdminPresentationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/v6/admin/presentations")
@RequiredArgsConstructor
public class AdminPresentationController {

	private final AdminPresentationService adminPresentationService;

	@PostMapping("/slots")
	public void registerPresentationSlot(@RequestBody @Valid AdminPresentationSlotRequestDto slotRequestDto) {
		adminPresentationService.registerPresentationSlot(new AdminPresentationSlotServiceDto(
				slotRequestDto.getStartTime(),
				slotRequestDto.getLocation()
		));
	}
}
