package org.ftclub.cabinet.alarm.service;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.domain.AlarmType;
import org.ftclub.cabinet.alarm.repository.AlarmOptInRepository;
import org.ftclub.cabinet.alarm.repository.AlarmStatusRepository;
import org.ftclub.cabinet.dto.UpdateAlarmRequestDto;
import org.ftclub.cabinet.user.domain.AlarmOptIn;
import org.ftclub.cabinet.user.domain.AlarmStatus;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class AlarmCommandService {

	private final AlarmOptInRepository alarmOptInRepository;
	private final AlarmStatusRepository alarmStatusRepository;

	//alarmTypeStatus 의 key 값을 순회하며 true일경우  currentAlarmTypes에 없으면 추가, 있으면 아무일도 하지 않는다
	//false일 경우 currentAlarmTypes에 있으면 삭제, 없으면 아무일도 하지 않는다
	public void updateAlarmStatus(User user, List<AlarmType> currentAlarmTypes,
			Map<AlarmType, Boolean> changedAlarmStatus) {

		for (Entry<AlarmType, Boolean> entry : changedAlarmStatus.entrySet()) {
			if (entry.getValue()) {
				if (!currentAlarmTypes.contains(entry.getKey())) {
					alarmOptInRepository.save(AlarmOptIn.of(user, entry.getKey()));
				}
			} else {
				if (currentAlarmTypes.contains(entry.getKey())) {
					alarmOptInRepository.deleteAlarmOptInByUserAndAlarmType(user.getUserId(),
							entry.getKey());
				}
			}
		}
	}

	public void updateAlarmStatusRe(UpdateAlarmRequestDto dto, AlarmStatus alarmStatus) {
		alarmStatus.update(dto);
	}
}
