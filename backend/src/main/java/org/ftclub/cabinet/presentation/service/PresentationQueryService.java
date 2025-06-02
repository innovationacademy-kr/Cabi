package org.ftclub.cabinet.presentation.service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PresentationQueryService {

	private final PresentationRepository presentationRepository;

	/**
	 * 주어진 기간 안에 등록되어 있는 프레젠테이션을 시간순으로 조회합니다.
	 *
	 * @param yearMonth yyyy-MM 형식의 연월
	 * @return 프레젠테이션 리스트
	 */
	public List<Presentation> getPresentationByYearMonth(YearMonth yearMonth) {
		LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
		LocalDateTime endDate = startDate.plusMonths(1);
		return presentationRepository.findAllWithinPeriod(startDate, endDate);
	}

}
