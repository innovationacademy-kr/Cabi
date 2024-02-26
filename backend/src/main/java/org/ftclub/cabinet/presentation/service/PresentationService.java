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
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresentationService {

	private final PresentationRepository presentationRepository;
	private final PresentationPolicyService presentationPolicyService;
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
		LocalDateTime end = now.plusMonths(3);

		List<Presentation> presentationList = presentationRepository.findByDateTime(now, end);
		List<LocalDateTime> invalidDates = presentationList.stream().map(p -> p.getDateTime())
				.collect(Collectors.toList());
		return new InvalidDateResponseDto(invalidDates);
	}
}
