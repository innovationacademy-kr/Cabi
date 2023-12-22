package org.ftclub.cabinet.alarm.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.repository.AlarmStatusRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.AlarmStatus;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class AlarmQueryService {

	private final AlarmStatusRepository alarmStatusRepository;

	public AlarmStatus findAlarmStatus(Long userId) {
		return alarmStatusRepository.findByUserId(userId).orElseThrow(() -> new ServiceException(
				ExceptionStatus.NOT_FOUND_USER));
	}

}
