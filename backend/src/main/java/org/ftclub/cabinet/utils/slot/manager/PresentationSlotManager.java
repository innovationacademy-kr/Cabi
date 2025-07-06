package org.ftclub.cabinet.utils.slot.manager;

import static org.ftclub.cabinet.presentation.domain.PresentationLocation.BASEMENT;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.PresentationSlotRegisterServiceDto;
import org.ftclub.cabinet.admin.presentation.service.AdminPresentationSlotService;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PresentationSlotManager {

	private final AdminPresentationSlotService adminPresentationSlotService;

	/**
	 * 프레젠테이션 슬롯을 생성합니다. 현재 시간을 기준으로 2개월 뒤의 둘째주 수요일 2시와 넷째주 수요일 2시에 프레젠테이션 슬롯을 생성합니다.
	 */
	public void generatePresentationSlotsMonthly() {
		LocalDateTime baseDate = LocalDateTime.now().plusMonths(2); // 2개월 뒤

		createAndRegisterSlot(baseDate, 2); // 둘째주
		createAndRegisterSlot(baseDate, 4); // 넷째주
	}

	/**
	 * 주어진 날짜와 주차에 해당하는 프레젠테이션 슬롯을 생성하고 등록합니다.
	 *
	 * @param baseDate 기준 날짜
	 * @param week     주차 (1부터 시작, 1: 첫째주, 2: 둘째주, ...)
	 */
	private void createAndRegisterSlot(LocalDateTime baseDate, int week) {
		LocalDateTime slotDateTime = baseDate
				.with(TemporalAdjusters.dayOfWeekInMonth(week, DayOfWeek.WEDNESDAY))
				.withHour(14).withMinute(0).withSecond(0).withNano(0);

		PresentationSlotRegisterServiceDto dto = new PresentationSlotRegisterServiceDto(
				slotDateTime, BASEMENT);
		adminPresentationSlotService.registerPresentationSlot(dto);
	}
}
