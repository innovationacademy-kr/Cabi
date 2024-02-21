package org.ftclub.cabinet.presentation.controller;


import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.PresentationFormRequestDto;
import org.ftclub.cabinet.presentation.service.PresentationService;
import org.springframework.validation.beanvalidation.SpringValidatorAdapter;
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
}
