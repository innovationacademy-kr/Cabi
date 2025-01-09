package org.ftclub.cabinet.presentation.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.dto.AbleDateResponseDto;
import org.ftclub.cabinet.dto.InvalidDateResponseDto;
import org.ftclub.cabinet.dto.PresentationFormData;
import org.ftclub.cabinet.dto.PresentationFormRequestDto;
import org.ftclub.cabinet.dto.PresentationFormResponseDto;
import org.ftclub.cabinet.dto.PresentationMainData;
import org.ftclub.cabinet.dto.PresentationMyPageDto;
import org.ftclub.cabinet.dto.PresentationMyPagePaginationDto;
import org.ftclub.cabinet.dto.PresentationUpdateDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.mapper.PresentationMapper;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;
import org.ftclub.cabinet.presentation.domain.PresentationTime;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PresentationService {

	private static final Integer PRESENTATION_PERIOD = 3;
	private static final Integer DEFAULT_PAGE = 0;
	private static final Integer MAX_MONTH = 3;
	private static final Integer FETCH_MULTIPLIER = 2;
	private static final String DATE_TIME = "dateTime";
	private final PresentationRepository presentationRepository;
	private final PresentationPolicyService presentationPolicyService;
	private final PresentationMapper presentationMapper;
	private final PresentationQueryService presentationQueryService;
	private final UserQueryService userQueryService;

	/**
	 * 수요 지식회 폼 저장
	 *
	 * @param userId 토큰 파싱을 통해 받아온 userId
	 * @param dto    신청서 작성에 필요한 정보들
	 */
	@Transactional
	public void createPresentationForm(Long userId, PresentationFormRequestDto dto) {
		presentationPolicyService.verifyReservationDate(dto.getDateTime());

		Presentation dummyForm =
				presentationQueryService.getOneDummyByDate(dto.getDateTime());

		dummyForm.updateDummyToUserForm(dto.getCategory(),
				dto.getPresentationTime(), dto.getDateTime(),
				dto.getSubject(), dto.getSummary(), dto.getDetail());

		User user = userQueryService.getUser(userId);
		dummyForm.setUser(user);
	}

	/**
	 * 예약 불가능한 날짜들을 반환합니다.
	 *
	 * @return
	 */
	public InvalidDateResponseDto getInvalidDate() {
		LocalDate now = LocalDate.now();
		LocalDateTime start = now.atStartOfDay();
		LocalDateTime end = start.plusMonths(MAX_MONTH);

		List<LocalDateTime> invalidDates =
				presentationQueryService.getRegisteredPresentations(start, end)
						.stream()
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
	public List<Presentation> getLatestPastPresentations(int count, PresentationStatus status) {
		LocalDate now = LocalDate.now();
		LocalDateTime limit = now.atStartOfDay();
		LocalDateTime start = limit.minusYears(10);
		PageRequest pageRequest = PageRequest.of(DEFAULT_PAGE, count * FETCH_MULTIPLIER,
				Sort.by(DATE_TIME).descending());

		List<Presentation> userForms = presentationQueryService.findUserFormsWithinPeriod(
				start, limit, pageRequest);

		return userForms.stream()
				.filter(p -> p.getPresentationStatus().equals(status))
				.limit(count)
				.collect(Collectors.toList());
	}

	/**
	 * 요청 날짜 기준 발표 예정의 신청서들을 개수만큼 반환
	 *
	 * @param count
	 * @return
	 */
	public List<Presentation> getLatestUpcomingPresentationsByCount(int count,
			PresentationStatus status) {
		LocalDate now = LocalDate.now();
		LocalDateTime start = now.atStartOfDay();
		LocalDateTime end = start.plusMonths(MAX_MONTH);
		PageRequest pageRequest = PageRequest.of(DEFAULT_PAGE, count * FETCH_MULTIPLIER,
				Sort.by(DATE_TIME).ascending());

		List<Presentation> userForms = presentationQueryService.findUserFormsWithinPeriod(
				start, end, pageRequest);
		return userForms.stream()
				.filter(p -> p.getPresentationStatus().equals(status))
				.limit(count)
				.collect(Collectors.toList());
	}

	/**
	 * 과거, 예정 신청서의 데이터들을 Dto 형식으로 반환
	 *
	 * @param pastFormCount     가장 가까운 과거 신청서의 개수
	 * @param upcomingFormCount 가장 가까운 미래 신청서의 개수
	 * @return
	 */
	public PresentationMainData getPastAndUpcomingPresentations(
			int pastFormCount, int upcomingFormCount) {
		List<Presentation> pastPresentations = getLatestPastPresentations(pastFormCount,
				PresentationStatus.DONE);

		List<Presentation> upcomingPresentations =
				getLatestUpcomingPresentationsByCount(upcomingFormCount,
						PresentationStatus.EXPECTED);

		List<PresentationFormData> past = pastPresentations.stream()
				.map(presentationMapper::toPresentationFormDataDto)
				.collect(Collectors.toList());
		List<PresentationFormData> upcoming = upcomingPresentations.stream()
				.map(presentationMapper::toPresentationFormDataDto)
				.collect(Collectors.toList());

		return presentationMapper.toPresentationMainData(past, upcoming);
	}

	/**
	 * 입력받은 기한 내의 신청서들을 반환합니다.
	 *
	 * @param yearMonth yyyy-MM 타입
	 * @return
	 */
	public PresentationFormResponseDto getUserPresentationSchedule(YearMonth yearMonth) {

		List<PresentationFormData> result =
				presentationQueryService.getPresentationsByYearMonth(yearMonth)
						.stream()
						.filter(presentation ->
								!presentation.getPresentationStatus()
										.equals(PresentationStatus.CANCEL))
						.map(presentationMapper::toPresentationFormDataDto)
						.collect(Collectors.toList());

		return new PresentationFormResponseDto(result);
	}

	public PresentationFormResponseDto getAdminPresentationSchedule(YearMonth yearMonth) {

		List<PresentationFormData> result =
				presentationQueryService.getPresentationsByYearMonth(yearMonth)
						.stream()
						.map(presentationMapper::toPresentationFormDataDto)
						.collect(Collectors.toList());

		return new PresentationFormResponseDto(result);
	}


	/**
	 * 해당 id 를 가진 발표의 상태를 변경합니다.
	 * <p>
	 * **** 추가 고려사항 -> 발표 3일전엔 확정 되어 update 불가인 정책이 있는지..?? -> 확인후 추가 해야할듯
	 * <p>
	 *
	 * @Pathvariable Long formId;
	 * @RequestBody { LocalDateTime dateTime; // new Date().toISOString() String status; // [예정, 완료,
	 * 취소] String location; // [3층 회의실, 지하 1층 오픈스튜디오] }
	 */
	@Transactional
	public void updatePresentationByFormId(Long formId, PresentationUpdateDto dto) {
		Presentation presentationToUpdate =
				presentationRepository.findById(formId)
						.orElseThrow(ExceptionStatus.INVALID_FORM_ID::asServiceException);

		// 날짜 변경시에만 유효성 검증
		if (!presentationToUpdate.getDateTime().isEqual(dto.getDateTime())) {
			presentationPolicyService.verifyReservationDate(dto.getDateTime());
		}

		// 발표 취소 시 해당 날짜에 더미 폼 생성
		if (dto.getStatus() == PresentationStatus.CANCEL) {
			Presentation presentation =
					Presentation.of(
							dto.getDateTime(),
							PresentationTime.HALF,
							"dummy",
							"dummy",
							"dummy");
			presentationRepository.save(presentation);
		}

		presentationToUpdate.adminUpdate(dto.getStatus(), dto.getDateTime(), dto.getLocation());
	}

	/**
	 * Page 타입으로 유저의 Presentation 객체들을 조회
	 *
	 * @param userId
	 * @param pageable
	 * @return
	 */
	public PresentationMyPagePaginationDto getUserPresentations(Long userId, Pageable pageable) {
		Page<Presentation> presentations = presentationQueryService.getPresentationsById(userId,
				pageable);

		List<PresentationMyPageDto> result = presentations.stream()
				.map(presentationMapper::toPresentationMyPageDto)
				.collect(Collectors.toList());

		return new PresentationMyPagePaginationDto(result, presentations.getTotalElements());
	}

	/*
		현재 달 기준 3달 앞까지 (ex.현재 1월 : 1, 2, 3월 dummy form 생성)
		2, 4주인 수요일의 form 만들기
		category Dummy로 만들기
	 */
	@Transactional
	public void generatePresentationFormsEveryThreeMonth(LocalDate nowDate) {
		List<LocalDateTime> wednesdays = getDummyPresentationFormsDate(nowDate);
		List<Presentation> presentations = wednesdays.stream()
				.map(wednesday -> Presentation.of(
						wednesday,
						PresentationTime.HALF,
						"dummy",
						"dummy",
						"dummy"
				))
				.collect(Collectors.toList());

		presentationRepository.saveAll(presentations);
	}

	/**
	 * 스케줄링이 도는 날짜 기준으로 2개월 후의 더미 데이터를 1개 작성한다.
	 *
	 * @param nowDate
	 * @return
	 */
	public List<LocalDateTime> getDummyPresentationFormsDate(LocalDate nowDate) {
		List<LocalDateTime> wednesdays = new ArrayList<>();

		// 2개월 뒤의 첫째 날을 구한다
		LocalDate firstDayOfMonth =
				nowDate.plusMonths(2).withDayOfMonth(1);

		// 해당 월의 첫 번째 수요일을 찾는다
		LocalDate firstWednesday = firstDayOfMonth.with(
				TemporalAdjusters.nextOrSame(DayOfWeek.WEDNESDAY));

		// 2번째 수요일은 첫 번째 수요일에서 1주 후
		LocalDate secondWednesday = firstWednesday.plusWeeks(1);

		// 4번째 수요일은 첫 번째 수요일에서 3주 후
		LocalDate fourthWednesday = firstWednesday.plusWeeks(3);

		wednesdays.add(secondWednesday.atStartOfDay().withHour(14));
		wednesdays.add(fourthWednesday.atStartOfDay().withHour(14));
		return wednesdays;
	}

	public AbleDateResponseDto getAbleDate() {
		LocalDateTime now = LocalDateTime.now()
				.withHour(0)
				.withMinute(0)
				.withSecond(0);
		List<Presentation> dummyDates =
				presentationQueryService.getDummyDateBetweenMonth(now,
						now.plusMonths(PRESENTATION_PERIOD));

		List<LocalDateTime> result =
				dummyDates.stream()
						.map(Presentation::getDateTime)
						.collect(Collectors.toList());

		return new AbleDateResponseDto(result);
	}
}
