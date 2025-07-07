package org.ftclub.cabinet.presentation.service;

import static org.ftclub.cabinet.presentation.domain.PresentationSlot.ALLOWED_PERIOD;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.dto.AvailablePresentationSlotDto;
import org.ftclub.cabinet.presentation.dto.DataListResponseDto;
import org.ftclub.cabinet.presentation.repository.PresentationSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PresentationSlotService {

	private static final int FIRST_DAY_OF_MONTH = 1;
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
}
