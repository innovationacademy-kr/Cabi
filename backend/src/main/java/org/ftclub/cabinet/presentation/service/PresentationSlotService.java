package org.ftclub.cabinet.presentation.service;

import static org.ftclub.cabinet.presentation.domain.PresentationSlot.ALLOWED_PERIOD;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.presentation.service.AdminPresentationSlotService;
import org.ftclub.cabinet.dto.AvailablePresentationSlotDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.dto.DataListResponseDto;
import org.ftclub.cabinet.presentation.repository.PresentationSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PresentationSlotService {

	private static final int FIRST_DAY_OF_MONTH = 1;
	private final AdminPresentationSlotService adminPresentationSlotService;
	private final PresentationSlotRepository presentationSlotRepository;
	private final Clock clock;

	public static LocalDateTime calculateEndTime(LocalDateTime now) {
		YearMonth targetMonth = YearMonth.from(now).plusMonths(ALLOWED_PERIOD);
		return targetMonth.atDay(FIRST_DAY_OF_MONTH).atStartOfDay();
	}

	@Transactional(readOnly = true)
	public DataListResponseDto<AvailablePresentationSlotDto> getPresentationSlots() {
		LocalDateTime now = LocalDateTime.now(clock);
		List<AvailablePresentationSlotDto> slotList = presentationSlotRepository.findByStartTimeBetween(
						now,
						calculateEndTime(now)).stream().filter(slot -> !slot.hasPresentation()).
				map(slot -> new AvailablePresentationSlotDto(slot.getId(),
						slot.getStartTime())
				).collect(Collectors.toList());
		return new DataListResponseDto<>(slotList);
	}

	/**
	 * 프레젠테이션 슬롯을 조회합니다.
	 *
	 * @param slotId
	 * @return
	 */
	@Transactional(readOnly = true)
	public PresentationSlot findPresentationSlotById(Long slotId) {
		return presentationSlotRepository.findById(slotId)
				.orElseThrow(ExceptionStatus.SLOT_NOT_FOUND::asServiceException);
	}

	/**
	 * 프레젠테이션 슬롯이 과거가 아니고, 3개월 이내인지 확인합니다. 이미 발표가 등록된 슬롯은 예외를 발생시킵니다.
	 *
	 * @param slotId 슬롯 ID
	 */
	@Transactional(readOnly = true)
	public void validateSlotAvailable(PresentationSlot slot) {
		if (slot.hasPresentation()) {
			throw ExceptionStatus.PRESENTATION_SLOT_ALREADY_HAS_PRESENTATION.asServiceException();
		}
		adminPresentationSlotService.validateSlotWithinAllowedPeriod(slot.getStartTime());
		adminPresentationSlotService.validateSlotPassed(slot.getStartTime());
	}
}
