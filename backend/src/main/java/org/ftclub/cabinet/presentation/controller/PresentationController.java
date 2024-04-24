package org.ftclub.cabinet.presentation.controller;


import java.time.YearMonth;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.auth.domain.AuthLevel;
import org.ftclub.cabinet.dto.InvalidDateResponseDto;
import org.ftclub.cabinet.dto.PresentationFormRequestDto;
import org.ftclub.cabinet.dto.PresentationFormResponseDto;
import org.ftclub.cabinet.dto.PresentationMainData;
import org.ftclub.cabinet.dto.PresentationMyPagePaginationDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.presentation.service.PresentationService;
import org.ftclub.cabinet.user.domain.UserSession;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/v5/presentation")
@RequiredArgsConstructor
public class PresentationController {

	private final PresentationService presentationService;

	@PostMapping("/form")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public void createPresentationForm(
			@UserSession UserSessionDto user,
			@Valid @RequestBody PresentationFormRequestDto dto) {
		presentationService.createPresentationForm(user.getUserId(), dto);
	}

	@GetMapping("/form/invalid-date")
	public InvalidDateResponseDto getInvalidDate() {
		return presentationService.getInvalidDate();
	}

	@GetMapping("")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public PresentationMainData getMainData(
			@RequestParam(value = "pastFormCount") Integer pastFormCount,
			@RequestParam(value = "upcomingFormCount") Integer upcomingFormCount) {
		return presentationService.getPastAndUpcomingPresentations(pastFormCount,
				upcomingFormCount);
	}

	@GetMapping("/schedule")
	public PresentationFormResponseDto getPresentationSchedule(
			@RequestParam(value = "yearMonth")
			@DateTimeFormat(pattern = "yyyy-MM")
			YearMonth yearMonth) {
		return presentationService.getUserPresentationSchedule(yearMonth);
	}

	/**
	 * 자신의 수요지식회 발표 현황을 조회합니다.
	 *
	 * @param user
	 * @param pageable
	 * @return
	 */
	@GetMapping("/me/histories")
	@AuthGuard(level = AuthLevel.USER_ONLY)
	public PresentationMyPagePaginationDto getUserPresentation(
			@UserSession UserSessionDto user,
			Pageable pageable
	) {
		return presentationService.getUserPresentations(user.getUserId(), pageable);
	}
}
