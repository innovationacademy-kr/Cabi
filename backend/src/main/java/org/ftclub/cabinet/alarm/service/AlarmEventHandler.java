package org.ftclub.cabinet.alarm.service;

import static org.ftclub.cabinet.alarm.domain.AlarmType.EMAIL;
import static org.ftclub.cabinet.alarm.domain.AlarmType.PUSH;
import static org.ftclub.cabinet.alarm.domain.AlarmType.SLACK;
import static org.ftclub.cabinet.exception.ExceptionStatus.NOT_FOUND_USER;

import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.AlarmType;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.AlarmOptOut;
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
		User receiver = userRepository.findUserWithOptOutById(alarmEvent.getReceiverId())
				.orElseThrow(() -> new ServiceException(NOT_FOUND_USER));
		Set<AlarmType> alarmOptOuts = receiver.getAlarmOptOuts()
				.stream().map(AlarmOptOut::getAlarmType).collect(Collectors.toSet());
		if (alarmOptOuts.contains(SLACK))
			slackAlarmSender.send(receiver, alarmEvent);
		else if (alarmOptOuts.contains(EMAIL))
			emailAlarmSender.send(receiver, alarmEvent);
		else if (alarmOptOuts.contains(PUSH))
			pushAlarmSender.send(receiver, alarmEvent);
	}
}
