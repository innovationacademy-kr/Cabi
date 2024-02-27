package org.ftclub.cabinet.presentation.service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.dto.InvalidDateResponseDto;
import org.ftclub.cabinet.dto.PresentationFormRequestDto;
import org.ftclub.cabinet.dto.PresentationFormResponseDto;
import org.ftclub.cabinet.mapper.PresentationMapper;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Slf4j
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

	public InvalidDateResponseDto getInvalidDate() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime end = now.plusMonths(MAX_MONTH);

		List<Presentation> presentationList = presentationRepository.findByDateTime(now, end);
		List<LocalDateTime> invalidDates = presentationList.stream()
			.map(Presentation::getDateTime)
			.collect(Collectors.toList());
		return new InvalidDateResponseDto(invalidDates);
	}

	public List<Presentation> getLatestPastPresentation(int count) {
		LocalDateTime now = LocalDateTime.now();
		Date date = Date.valueOf(now.toLocalDate());
		return presentationRepository
			.findLatestPastPresentation(date, PageRequest.of(0, count));
	}

	public List<Presentation> getLatestTwoUpcomingPresentations(int count) {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime end = now.plusMonths(MAX_MONTH);
		Date nowDate = Date.valueOf(now.toLocalDate());
		Date endDate = Date.valueOf(end.toLocalDate());
		return presentationRepository
			.findUpcomingPresentations(nowDate, endDate, PageRequest.of(0, count));
	}

	public PresentationFormResponseDto getThreePresentationForms(int pastFormCount,
		int upcomingFormCount) {
		List<Presentation> pastPresentations = getLatestPastPresentation(pastFormCount);
		List<Presentation> upcomingPresentations = getLatestTwoUpcomingPresentations(
			upcomingFormCount);

		List<Presentation> presentations = new ArrayList<>();
		presentations.addAll(pastPresentations);
		presentations.addAll(upcomingPresentations);

		return new PresentationFormResponseDto(presentations.stream()
			.map(form -> {
				String userName = form.getUser().getName();
				return presentationMapper.toPresentationFormDataDto(form, userName);
			}).collect(Collectors.toList())
		);
	}
}
