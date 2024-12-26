package org.ftclub.cabinet.item.service;

import java.util.List;
import java.util.Optional;
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

	public List<SectionAlarm> findUnsentAlarm(Long userId, String building, Integer floor) {
		return sectionAlarmRepository.findAllByUserIdAndCabinetPlaceAndAlarmedAtIsNull(
				userId, building, floor);
	}

	public Optional<SectionAlarm> findUnsentAlarmDesc(Long userId, Long cabinetPlaceId) {
		return sectionAlarmRepository.findAllByUserIdAndCabinetPlaceIdOrderByIdDesc(
						userId, cabinetPlaceId).stream()
				.filter(sectionAlarm -> sectionAlarm.getAlarmedAt() == null).findFirst();

	}
}
