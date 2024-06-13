package org.ftclub.cabinet.alarm.handler;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.AvailableSectionAlarm;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.item.service.SectionAlarmCommandService;
import org.ftclub.cabinet.item.service.SectionAlarmQueryService;
import org.ftclub.cabinet.lent.service.LentRedisService;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class SectionAlarmManager {

	private final SectionAlarmQueryService sectionAlarmQueryService;
	private final SectionAlarmCommandService sectionAlarmCommandService;
	private final CabinetQueryService cabinetQueryService;
	private final LentRedisService lentRedisService;
	private final ApplicationEventPublisher eventPublisher;


	@Transactional
	public void sendSectionAlarm() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime from = LocalDate.now().atStartOfDay();

		// 오늘 열리는 모든 사물함 조회
		List<Cabinet> allPendingCabinets =
				cabinetQueryService.findAllPendingCabinets(CabinetStatus.PENDING);
		// 반납일이 오늘 이전인 사물함만 필터링
		Map<Location, List<Cabinet>> locationCabinetMap = allPendingCabinets.stream()
				.filter(cabinet ->
						lentRedisService.getPreviousEndedAt(cabinet.getId()).isBefore(from))
				.collect(groupingBy(cabinet -> cabinet.getCabinetPlace().getLocation(),
						mapping(cabinet -> cabinet, Collectors.toList())));

		// 사용되지 않은 알람권 조회
		List<Long> alarmIds = new ArrayList<>();
		sectionAlarmQueryService.getUnsentAlarms().forEach(alarm -> {
			Location location = alarm.getCabinetPlace().getLocation();
			// 오늘 열리는 사물함인 경우에만 알람 이벤트 생성
			if (locationCabinetMap.containsKey(location)) {
				alarmIds.add(alarm.getId());
				eventPublisher.publishEvent(
						AlarmEvent.of(alarm.getUserId(), new AvailableSectionAlarm(location)));
			}
		});
		// 사용된 알림권 업데이트
		if (!alarmIds.isEmpty()) {
			sectionAlarmCommandService.updateAlarmSend(alarmIds, now);
		}
	}
}
