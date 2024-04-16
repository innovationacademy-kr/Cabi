package org.ftclub.cabinet.admin.presentation.controller;

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

import java.time.YearMonth;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.dto.PresentationFormResponseDto;
import org.ftclub.cabinet.dto.PresentationUpdateDto;
import org.ftclub.cabinet.presentation.service.PresentationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
			@Valid @RequestBody PresentationUpdateDto dto) {
		presentationService.updatePresentationByFormId(formId, dto);
	}

	@GetMapping("/schedule")
	@AuthGuard(level = ADMIN_ONLY)
	public PresentationFormResponseDto adminSchedulePage(@RequestParam(value = "yearMonth")
	@DateTimeFormat(pattern = "yyyy-MM")
	YearMonth yearMonth) {
		return presentationService.getAdminPresentationSchedule(yearMonth);
	}
}
