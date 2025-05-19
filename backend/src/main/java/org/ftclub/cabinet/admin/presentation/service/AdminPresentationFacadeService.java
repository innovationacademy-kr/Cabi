package org.ftclub.cabinet.admin.presentation.service;

import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminPresentationResponseDto;
import org.ftclub.cabinet.mapper.PresentationMapper;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.service.PresentationQueryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminPresentationFacadeService {

	private final PresentationQueryService presentationQueryService;
	private final PresentationMapper presentationMapper;

	/**
	 * 어드민의 일정 관리에서 해당 연월의 프레젠테이션 목록을 조회합니다.
	 *
	 * @param yearMonth
	 * @return
	 */
	@Transactional(readOnly = true)
	public List<AdminPresentationResponseDto> getPresentationByDate(YearMonth yearMonth) {
		// 연월에 해당하는 모든 프레젠테이션 목록을 조회(취소 포함)
		List<Presentation> presentations = presentationQueryService.getPresentationByYearMonth(
				yearMonth);

		return presentations.stream()
				.map(presentationMapper::toAdminPresentationResponseDto)
				.collect(Collectors.toList());
	}
}
