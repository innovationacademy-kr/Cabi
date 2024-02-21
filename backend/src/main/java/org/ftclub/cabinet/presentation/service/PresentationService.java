package org.ftclub.cabinet.presentation.service;

import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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
}
