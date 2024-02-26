package org.ftclub.cabinet.presentation.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.InvalidDateResponseDto;
import org.ftclub.cabinet.dto.PresentationFormRequestDto;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresentationService {

	private final PresentationRepository presentationRepository;

	@Transactional
	public void createPresentationFromByInformation(PresentationFormRequestDto dto) {
		Presentation presentation = Presentation.of(dto.getCategory(), dto.getDateTime(),
				dto.getPresentationTime(), dto.getSubject(), dto.getSummary(), dto.getDetail());
		presentationRepository.save(presentation);
	}

	public InvalidDateResponseDto getInvalidDate() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime end = now.plusMonths(3);

		List<Presentation> presentationList = presentationRepository.findByDateTime(now, end);
		List<LocalDateTime> invalidDates = presentationList.stream().map(p -> p.getDateTime())
				.collect(Collectors.toList());
		return new InvalidDateResponseDto(invalidDates);
	}
}
