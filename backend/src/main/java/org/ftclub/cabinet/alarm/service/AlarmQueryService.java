package org.ftclub.cabinet.alarm.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.repository.AlarmOptInRepository;
import org.ftclub.cabinet.alarm.repository.AlarmStatusRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.AlarmOptIn;
import org.ftclub.cabinet.user.domain.AlarmStatus;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class AlarmQueryService {

	private final AlarmOptInRepository alarmOptInRepository;
	private final AlarmStatusRepository alarmStatusRepository;

	public List<AlarmOptIn> findAllAlarmOptInByUserId(Long userId) {
		return alarmOptInRepository.findAllByUserId(userId);
	}

	public AlarmStatus findAlarmStatusByUserId(Long userId) {
		return alarmStatusRepository.findByUserId(userId).orElseThrow(() -> new ServiceException(
				ExceptionStatus.NOT_FOUND_USER));
	}

}
