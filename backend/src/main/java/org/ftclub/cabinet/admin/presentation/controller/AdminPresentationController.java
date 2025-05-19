package org.ftclub.cabinet.admin.presentation.controller;

import java.time.YearMonth;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminPresentationResponseDto;
import org.ftclub.cabinet.admin.presentation.service.AdminPresentationFacadeService;
import org.ftclub.cabinet.presentation.dto.DataListResponseDto;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v6/admin/presentations")
@RequiredArgsConstructor
public class AdminPresentationController {

	private final AdminPresentationFacadeService adminPresentationFacadeService;

	/**
	 * 어드민의 달력에 필요한 발표 데이터를 반환합니다.
	 *
	 * @param yearMonth yyyy-MM 형식의 연월
	 * @return 프레젠테이션 목록
	 */
	@GetMapping
	public DataListResponseDto<AdminPresentationResponseDto> getPresentationsByDate(
			@RequestParam(value = "yearMonth")
			@DateTimeFormat(pattern = "yyyy-MM")
			YearMonth yearMonth) {
		List<AdminPresentationResponseDto> results = adminPresentationFacadeService.getPresentationByDate(
				yearMonth);

		return new DataListResponseDto<>(results);
	}

}
