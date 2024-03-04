package org.ftclub.cabinet.admin.presentation.controller;

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.dto.PresentationUpdateDto;
import org.ftclub.cabinet.presentation.service.PresentationService;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/v5/admin/presentation")
@RequiredArgsConstructor
public class AdminPresentationController {

	private final PresentationService presentationService;

	@PatchMapping("/{formId}/update")
	@AuthGuard(level = ADMIN_ONLY)
	public void updatePresentationByFormId(
			@PathVariable("formId") Long formId,
			@RequestBody PresentationUpdateDto dto) {
		presentationService.updatePresentationByFormId(formId, dto);
	}
}
