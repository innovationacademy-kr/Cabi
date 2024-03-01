package org.ftclub.cabinet.presentation.service;

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
import org.ftclub.cabinet.dto.PresentationUpdateDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.mapper.PresentationMapper;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.ftclub.cabinet.utils.DateUtil;
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

	/**
	 * 예약 불가능한 날짜들을 반환합니다.
	 *
	 * @return
	 */
	public InvalidDateResponseDto getInvalidDate() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime end = now.plusMonths(MAX_MONTH);

		List<Presentation> presentationList =
				presentationRepository.findByDateTime(DateUtil.toDate(now), DateUtil.toDate(end));
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
	public List<Presentation> getLatestPastPresentations(int count) {
		LocalDateTime now = LocalDateTime.now();

		return presentationRepository
				.findLatestPastPresentations(DateUtil.toDate(now), PageRequest.of(0, count));
	}

	/**
	 * 요청 날짜 기준 발표 예정의 신청서들을 개수만큼 반환(당일 포함)
	 *
	 * @param count
	 * @return
	 */
	public List<Presentation> getLatestUpcomingPresentations(int count) {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime end = now.plusMonths(MAX_MONTH);
		return presentationRepository
				.findUpcomingPresentations(DateUtil.toDate(now), DateUtil.toDate(end),
						PageRequest.of(0, count));
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
		List<Presentation> pastPresentations = getLatestPastPresentations(pastFormCount);
		List<Presentation> upcomingPresentations = getLatestUpcomingPresentations(
				upcomingFormCount);

		List<PresentationFormData> result = Stream.concat(
						pastPresentations.stream(), upcomingPresentations.stream())
				.map(form ->
						presentationMapper.toPresentationFormDataDto(form,
								form.getUser().getName()))
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
								presentationMapper.toPresentationFormDataDto(form,
										form.getUser().getName()))
						.collect(Collectors.toList());

		return new PresentationFormResponseDto(result);
	}


	/**
	 * 해당 id 를 가진 발표의 상태를 변경합니다.
	 * <p>
	 * **** 추가 고려사항 -> 발표 3일전엔 확정 되어 update 불가인 정책이 있는지..?? -> 확인후 추가 해야할듯 **** 변경할 사항이
	 * <p>
	 * entity에 location 컬럼 X 존재하지 않는 pk를 받은 경우 400 에러
	 * <p>
	 * status에 없는 상태를 받은 경우 400에러
	 *
	 * @Pathvariable Long formId;
	 * @RequestBody { LocalDateTime dateTime; // new Date().toISOString() String status; // [예정, 완료,
	 * 취소] String location; // [3층 회의실, 지하 1층 오픈스튜디오] }
	 */
	public void updatePresentationByFormId(Long formId, PresentationUpdateDto dto) {
		presentationPolicyService.verifyReservationDate(dto.getDateTime());
		PresentationStatus newStatus = presentationPolicyService.verityPresentationStatus(
				dto.getStatus());
		PresentationLocation newLocation = presentationPolicyService.verityPresentationLocation(
				dto.getLocation());
		Presentation presentationToUpdate =
				presentationRepository.findById(formId)
						.orElseThrow(() -> ExceptionStatus.INVALID_FORM_ID.asServiceException());

		presentationToUpdate.setPresentationStatus(newStatus);
		presentationToUpdate.setDateTime(dto.getDateTime());
		presentationToUpdate.setPresentationLocation(newLocation);

		presentationRepository.save(presentationToUpdate);
	}
}
