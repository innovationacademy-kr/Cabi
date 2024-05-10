package org.ftclub.cabinet.item.service;

import java.time.LocalDateTime;
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
public class SectionAlarmCommandService {

	private final SectionAlarmRepository sectionAlarmRepository;


	public void addSectionAlarm(Long userId, Long cabinetPlaceId) {
		SectionAlarm sectionAlarm = SectionAlarm.of(userId, cabinetPlaceId);
		sectionAlarmRepository.save(sectionAlarm);
	}

	public void updateAlarmSend(List<Long> sectionAlarmIds, LocalDateTime sentDate) {
		sectionAlarmRepository.updateAlarmedAtBulk(sectionAlarmIds, sentDate);
	}
}
