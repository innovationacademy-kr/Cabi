package org.ftclub.cabinet.presentation.service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresentationQueryService {
	private final PresentationRepository presentationRepository;

	public Presentation getPresentation(Long presentationId) {
		return presentationRepository.findById(presentationId)
				.orElseThrow(ExceptionStatus.NOT_FOUND_PRESENTATION::asServiceException);
	}
}
