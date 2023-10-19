package org.ftclub.cabinet.alarm.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class AlarmEventHandler {
	private final UserRepository userRepository;
	private final SlackAlarmSender slackAlarmSender;
	private final EmailAlarmSender emailAlarmSender;
	private final PushAlarmSender pushAlarmSender;

	@TransactionalEventListener
	public void handleAlarmEvent(AlarmEvent alarmEvent) {
		User receiver = userRepository.findById(alarmEvent.getReceiverId()).orElseThrow();
		//TODO id로 멤버 조회 및 OPTIONS 조회
		//TODO sender별로 매개변수 다름. + 조건분기
		slackAlarmSender.send(alarmEvent);
		emailAlarmSender.send(alarmEvent);
		pushAlarmSender.send(alarmEvent);
	}
}
