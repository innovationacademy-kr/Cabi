package org.ftclub.cabinet.presentation.controller;


import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.InvalidDateResponseDto;
import org.ftclub.cabinet.dto.PresentationFormRequestDto;
import org.ftclub.cabinet.presentation.service.PresentationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v5/presentation")
@RequiredArgsConstructor
public class PresentationController {

	private final PresentationService presentationService;

	@PostMapping("/form")
	public void createPresentationForm(@RequestBody PresentationFormRequestDto dto) {
		presentationService.createPresentationFromByInformation(dto);
	}

	@GetMapping("/form/invalid-date")
	public InvalidDateResponseDto getInvalidDate() {
		return presentationService.getInvalidDate();
	}
}
