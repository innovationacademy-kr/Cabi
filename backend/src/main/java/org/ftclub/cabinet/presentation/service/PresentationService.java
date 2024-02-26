package org.ftclub.cabinet.presentation.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.PresentationFormRequestDto;
import org.ftclub.cabinet.dto.PresentationFormResponseDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.mapper.PresentationMapper;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresentationService {

	private static final Integer MAX_MONTH = 3;

	private final PresentationRepository presentationRepository;
	private final PresentationPolicyService presentationPolicyService;
	private final PresentationMapper presentationMapper;
	private final UserQueryService userQueryService;

	/**
	 * 수요 지식회 폼 저장
	 *
	 * @param userId 토큰 파싱을 통해 받아온 userId
	 * @param dto    신청서 작성에 필요한 정보들
	 */
	@Transactional
	public void createPresentationFrom(Long userId, PresentationFormRequestDto dto) {
		presentationPolicyService.verifyReservationDate(dto.getDateTime());

		Presentation presentation = Presentation.of(dto.getCategory(), dto.getDateTime(),
			dto.getPresentationTime(), dto.getSubject(), dto.getSummary(), dto.getDetail());
		User user = userQueryService.getUser(userId);

		presentation.setUser(user);

		presentationRepository.save(presentation);
	}

	public Presentation getLatestPastPresentation() {
		LocalDateTime now = LocalDateTime.now();
		return presentationRepository
			.findFirstByDateTimeBeforeOrderByDateTimeDesc(now)
			.orElseThrow(ExceptionStatus.NOT_FOUND_FORM::asServiceException);
	}

	public List<Presentation> getLatestTwoUpcomingPresentations() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime afterThreeMonth = now.plusMonths(MAX_MONTH);
		return presentationRepository
			.findFirst2ByDateTimeAfterAndDateTimeBeforeOrderByDateTimeAsc(now, afterThreeMonth);
	}

	public PresentationFormResponseDto getThreePresentationForms() {
		Presentation pastPresentation = getLatestPastPresentation();
		List<Presentation> upcomingPresentations = getLatestTwoUpcomingPresentations();

		List<Presentation> presentations = new ArrayList<>();
		presentations.add(pastPresentation);
		presentations.addAll(upcomingPresentations);

		return new PresentationFormResponseDto(presentations.stream()
			.map(form -> {
				String userName = form.getUser().getName();
				return presentationMapper.toPresentationFormDataDto(form, userName);
			}).collect(Collectors.toList())
		);
	}
}
