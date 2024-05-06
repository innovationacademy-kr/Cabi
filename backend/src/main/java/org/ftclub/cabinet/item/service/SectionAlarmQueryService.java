package org.ftclub.cabinet.item.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.item.domain.SectionAlarm;
import org.ftclub.cabinet.item.repository.SectionAlarmRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class SectionAlarmQueryService {

	private final SectionAlarmRepository sectionAlarmRepository;


	public List<SectionAlarm> getUnsentAlarms() {
		return sectionAlarmRepository.findAllByAlarmedAtIsNull();
	}
}
