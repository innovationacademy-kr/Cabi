package org.ftclub.cabinet.alarm.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.UpdateAlarmRequestDto;
import org.ftclub.cabinet.user.domain.AlarmStatus;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class AlarmCommandService {

	public void updateAlarmStatusRe(UpdateAlarmRequestDto dto, AlarmStatus alarmStatus) {
		alarmStatus.update(dto);
	}
}
