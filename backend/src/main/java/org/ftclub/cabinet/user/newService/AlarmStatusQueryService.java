package org.ftclub.cabinet.user.newService;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.repository.AlarmStatusRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.AlarmStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class AlarmStatusQueryService {

	private final AlarmStatusRepository alarmStatusRepository;


	public AlarmStatus getUserAlarmStatus(Long userId) {
		return alarmStatusRepository.findByUserIdJoinUser(userId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.INVALID_STATUS));
	}
}
