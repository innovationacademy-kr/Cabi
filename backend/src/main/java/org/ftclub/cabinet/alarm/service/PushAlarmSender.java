package org.ftclub.cabinet.alarm.service;

import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Component;

@Component
public class PushAlarmSender {
	void send(User user, AlarmEvent alarmEvent) {
//		fcmService.sendPushMessage(activeLent.getName(), overdueType, activeLent.getDaysLeftFromExpireDate());
	}
}
