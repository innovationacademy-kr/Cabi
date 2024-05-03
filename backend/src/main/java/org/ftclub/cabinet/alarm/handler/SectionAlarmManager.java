package org.ftclub.cabinet.alarm.handler;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.item.domain.SectionAlarm;
import org.ftclub.cabinet.item.service.SectionAlarmCommandService;
import org.ftclub.cabinet.item.service.SectionAlarmQueryService;
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
	private final ApplicationEventPublisher eventPublisher;


	@Transactional(readOnly = true)
	public void sendSectionAlarm() {
		List<SectionAlarm> unsentAlarms = sectionAlarmQueryService.getUnsentAlarms();
	}
}
