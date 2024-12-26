package org.ftclub.cabinet.presentation.service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresentationQueryService {

	private static final Integer START_DAY = 1;

	private final PresentationRepository presentationRepository;

	public List<Presentation> getRegisteredPresentations(LocalDateTime start, LocalDateTime end) {
		List<Presentation> presentations =
				presentationRepository.findAllByDateTimeBetween(start, end);

		return presentations.stream()
				.filter(presentation ->
						presentation.getPresentationStatus().equals(PresentationStatus.EXPECTED)
								&& presentation.getUser() != null
				)
				.collect(Collectors.toList());
	}

	public List<Presentation> getPresentationsByYearMonth(YearMonth yearMonth) {
		LocalDateTime startDate = yearMonth.atDay(START_DAY).atStartOfDay();
		LocalDateTime endDayDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);

		return presentationRepository.findAllByDateTimeBetweenOrderByDateTime(startDate,
				endDayDate);
	}

	public Presentation getOneDummyByDate(LocalDateTime dateTime) {
		LocalDateTime startOfDate = dateTime.withHour(0).withMinute(0).withSecond(0);
		LocalDateTime endOfDate = dateTime.withHour(23).withMinute(59).withSecond(59);
		return presentationRepository.findAllByDateTimeBetween(startOfDate, endOfDate)
				.stream()
				.filter(p -> p.getUser() == null)
				.findFirst()
				.orElseThrow(ExceptionStatus.INVALID_PRESENTATION_DATE::asServiceException);
	}

	public Page<Presentation> getPresentationsById(Long id, Pageable pageable) {
		return presentationRepository.findPaginationById(id, pageable);
	}

	public List<Presentation> getDummyDateBetweenMonth(
			LocalDateTime now,
			LocalDateTime localDateTime) {

		List<Presentation> presentations =
				presentationRepository.findAllByDateTimeBetweenOrderByDateTime(now, localDateTime);

		return presentations.stream()
				.filter(presentation -> presentation.getUser() == null)
				.collect(Collectors.toList());
	}

	public List<Presentation> findUserFormsWithinPeriod(
			LocalDateTime start,
			LocalDateTime end,
			PageRequest pageRequest) {
		return presentationRepository.findAllBetweenAndNotNullUser(start, end, pageRequest);
	}
}
