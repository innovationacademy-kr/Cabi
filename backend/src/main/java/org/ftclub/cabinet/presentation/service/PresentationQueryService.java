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
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresentationQueryService {

	private final PresentationRepository presentationRepository;

	public List<Presentation> getRegisteredPresentations(LocalDateTime start, LocalDateTime end) {
		List<Presentation> presentations =
			presentationRepository.findAllByDateTimeBetween(start, end);

		return presentations.stream()
			.filter(presentation ->
				!presentation.getPresentationStatus().equals(PresentationStatus.CANCEL))
			.collect(Collectors.toList());
	}

	public List<Presentation> getPresentationsBetweenWithPageRequest(LocalDateTime start,
		LocalDateTime end,
		PageRequest pageRequest) {
		return presentationRepository.findByDateTimeBetween(start, end, pageRequest);
	}

	public List<Presentation> getPresentationsByYearMonth(LocalDateTime start, LocalDateTime end) {
		return presentationRepository.findAllByDateTimeBetweenOrderByDateTime(start, end);
	}

	public Page<Presentation> getPresentationsById(Long id, Pageable pageable) {
		return presentationRepository.findPaginationById(id, pageable);
	}

}
