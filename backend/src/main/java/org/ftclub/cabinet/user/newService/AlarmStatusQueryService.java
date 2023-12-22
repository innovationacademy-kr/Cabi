package org.ftclub.cabinet.user.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.alarm.repository.AlarmStatusRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.AlarmStatus;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlarmStatusQueryService {

	private final AlarmStatusRepository alarmStatusRepository;


	public AlarmStatus getUserAlarmStatus(Long userId) {
		return alarmStatusRepository.findByUserIdJoinUser(userId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.INVALID_STATUS));
	}
}
