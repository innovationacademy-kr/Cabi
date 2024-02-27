package org.ftclub.cabinet.presentation.service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.dto.InvalidDateResponseDto;
import org.ftclub.cabinet.dto.PresentationFormData;
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

	private static final Integer START_DAY = 1;
	// 쿼리로 받?
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

	/**
	 * 요청 날짜 기준 과거의 신청서 중 가장 최신 Date의 정보를 개수만큼 반환
	 *
	 * @param count
	 * @return
	 */
	public List<Presentation> getLatestPastPresentation(int count) {
		LocalDateTime now = LocalDateTime.now();
		Date date = Date.valueOf(now.toLocalDate());
		return presentationRepository
			.findLatestPastPresentation(date, PageRequest.of(0, count));
	}

	/**
	 * 요청 날짜 기준 발표 예정의 신청서들을 개수만큼 반환(당일 포함)
	 *
	 * @param count
	 * @return
	 */
	public List<Presentation> getLatestTwoUpcomingPresentations(int count) {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime end = now.plusMonths(MAX_MONTH);
		Date nowDate = Date.valueOf(now.toLocalDate());
		Date endDate = Date.valueOf(end.toLocalDate());
		return presentationRepository
			.findUpcomingPresentations(nowDate, endDate, PageRequest.of(0, count));
	}

	/**
	 * 과거, 예정 신청서의 데이터들을 Dto 형식으로 반환
	 *
	 * @param pastFormCount     가장 가까운 과거 신청서의 개수
	 * @param upcomingFormCount 가장 가까운 미래 신청서의 개수
	 * @return
	 */
	public PresentationFormResponseDto getPastAndUpcomingPresentations(int pastFormCount,
		int upcomingFormCount) {
		List<Presentation> pastPresentations = getLatestPastPresentation(pastFormCount);
		List<Presentation> upcomingPresentations = getLatestTwoUpcomingPresentations(
			upcomingFormCount);

		List<PresentationFormData> result = Stream.concat(
				pastPresentations.stream(), upcomingPresentations.stream())
			.map(form ->
				presentationMapper.toPresentationFormDataDto(form, form.getUser().getName()))
			.collect(Collectors.toList());

		return new PresentationFormResponseDto(result);
	}

	/**
	 * 입력받은 기한 내의 신청서들을 반환합니다.
	 *
	 * @param yearMonth yyyy-MM 타입
	 * @return
	 */
	public PresentationFormResponseDto getPresentationSchedule(YearMonth yearMonth) {
		LocalDateTime startDate = yearMonth.atDay(START_DAY).atStartOfDay();
		LocalDateTime endDayDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);

		List<PresentationFormData> result =
			presentationRepository.findByDateTimeBetween(startDate, endDayDate).stream()
				.map(form ->
					presentationMapper.toPresentationFormDataDto(form, form.getUser().getName()))
				.collect(Collectors.toList());

		return new PresentationFormResponseDto(result);
	}
}
