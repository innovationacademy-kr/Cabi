package org.ftclub.cabinet.alarm.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class AlarmEventHandler {
	private final SlackAlarmSender slackAlarmSender;
	private final EmailAlarmSender emailAlarmSender;
	private final PushAlarmSender pushAlarmSender;

	@TransactionalEventListener
	public void handleAlarmEvent(AlarmEvent alarmEvent) {
		//TODO sender별로 매개변수 다름.
		slackAlarmSender.send(alarmEvent);
		emailAlarmSender.send(alarmEvent);
		pushAlarmSender.send(alarmEvent);
	}
}
