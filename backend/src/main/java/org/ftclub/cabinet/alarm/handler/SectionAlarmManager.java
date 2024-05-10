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

		List<Cabinet> allPendingCabinets =
				cabinetQueryService.findAllPendingCabinets(CabinetStatus.PENDING);
		Map<Location, List<Cabinet>> locationCabinetMap = allPendingCabinets.stream()
				.filter(cabinet ->
						lentRedisService.getPreviousEndedAt(cabinet.getId()).isBefore(from))
				.collect(groupingBy(cabinet -> cabinet.getCabinetPlace().getLocation(),
						mapping(cabinet -> cabinet, Collectors.toList())));

		List<Long> alarmIds = new ArrayList<>();
		sectionAlarmQueryService.getUnsentAlarms().forEach(alarm -> {
			Location location = alarm.getCabinetPlace().getLocation();
			if (locationCabinetMap.containsKey(location)) {
				alarmIds.add(alarm.getId());
				eventPublisher.publishEvent(
						AlarmEvent.of(alarm.getUserId(), new AvailableSectionAlarm(location)));
			}
		});
		if (!alarmIds.isEmpty()) {
			sectionAlarmCommandService.updateAlarmSend(alarmIds, now);
		}
	}
}
