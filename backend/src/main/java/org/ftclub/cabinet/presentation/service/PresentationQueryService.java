package org.ftclub.cabinet.presentation.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresentationQueryService {

	private static final Integer DEFAULT_PAGE = 0;
	private static final Integer DEFAULT_MINUS_YEAR = 10;
	private static final String DATE_TIME = "dateTime";

	private final PresentationRepository presentationRepository;

	public List<Presentation> getRegisteredPresentations(LocalDateTime start, LocalDateTime end) {
		List<Presentation> presentations =
			presentationRepository.findAllByDateTimeBetween(start, end);

		return presentations.stream()
			.filter(presentation ->
				!presentation.getPresentationStatus().equals(PresentationStatus.CANCEL))
			.collect(Collectors.toList());
	}

	public List<Presentation> getLatestPastPresentationsByCount(
		LocalDateTime limitDate, int count) {
		LocalDateTime start = limitDate.minusYears(DEFAULT_MINUS_YEAR);
		PageRequest pageRequest =
			PageRequest.of(DEFAULT_PAGE, count, Sort.by(DATE_TIME).descending());

		return presentationRepository.findByDateTimeBetween(start, limitDate,
			pageRequest);
	}

	public List<Presentation> getUpcomingPresentationByCount(LocalDateTime start, LocalDateTime end,
		int count) {

		PageRequest pageRequest =
			PageRequest.of(DEFAULT_PAGE, count, Sort.by(DATE_TIME).ascending());

		return presentationRepository.findByDateTimeBetween(start, end, pageRequest);
	}

	public List<Presentation> getPresentationsByYearMonth(LocalDateTime start, LocalDateTime end) {
		return presentationRepository.findAllByDateTimeBetweenOrderByDateTime(start, end);
	}

	public Page<Presentation> getPresentationsById(Long id, Pageable pageable) {
		return presentationRepository.findPaginationById(id, pageable);
	}

}
