package org.ftclub.cabinet.presentation.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.AvailablePresentationSlotDto;
import org.ftclub.cabinet.presentation.dto.DataListResponseDto;
import org.ftclub.cabinet.presentation.service.PresentationSlotService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v6/presentations")
@RequiredArgsConstructor
public class PresentationSlotController {

	private final PresentationSlotService presentationSlotService;

	@GetMapping("/slots")
	public DataListResponseDto<AvailablePresentationSlotDto> getPresentationSlots() {
		return presentationSlotService.getPresentationSlots();
	}
}
