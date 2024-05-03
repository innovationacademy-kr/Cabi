package org.ftclub.cabinet.alarm.handler;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.AvailableSectionAlarm;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.service.CabinetQueryService;
import org.ftclub.cabinet.item.domain.SectionAlarm;
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
		LocalDateTime from = LocalDate.now().atStartOfDay();
		List<Cabinet> allPendingCabinets =
				cabinetQueryService.findAllPendingCabinets(CabinetStatus.PENDING);
		Set<Location> availableLocations = allPendingCabinets.stream()
				.filter(cabinet ->
						lentRedisService.getPreviousEndedAt(cabinet.getId()).isBefore(from))
				.map(cabinet -> cabinet.getCabinetPlace().getLocation())
				.collect(Collectors.toSet());

		List<SectionAlarm> unsentAlarms = sectionAlarmQueryService.getUnsentAlarms();
		unsentAlarms.forEach(alarm -> {
			Location location = alarm.getCabinetPlace().getLocation();
			if (availableLocations.contains(location)) {
				AvailableSectionAlarm sectionAlarm =
						new AvailableSectionAlarm(location.getBuilding(),
								location.getFloor(),
								location.getSection());
				eventPublisher.publishEvent(AlarmEvent.of(alarm.getUserId(), sectionAlarm));
			}
		});

		List<Long> alarmIds = unsentAlarms.stream()
				.map(SectionAlarm::getId).collect(Collectors.toList());
		sectionAlarmCommandService.updateAlarmSend(alarmIds, LocalDateTime.now());
	}
}
