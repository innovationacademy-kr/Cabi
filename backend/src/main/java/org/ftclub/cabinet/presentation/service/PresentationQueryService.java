package org.ftclub.cabinet.presentation.service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresentationQueryService {

	private final PresentationRepository presentationRepository;

	public List<Presentation> getPresentationByYearMonth(YearMonth yearMonth) {
		LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
		LocalDateTime endDate = startDate.plusMonths(1);
		return presentationRepository.findAllWithinPeriod(startDate, endDate);
	}

}
