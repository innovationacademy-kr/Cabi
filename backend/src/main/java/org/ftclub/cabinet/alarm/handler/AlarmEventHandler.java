package org.ftclub.cabinet.alarm.handler;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.AlarmType;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.AlarmOptOut;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.Set;
import java.util.stream.Collectors;

import static org.ftclub.cabinet.alarm.domain.AlarmType.*;
import static org.ftclub.cabinet.exception.ExceptionStatus.NOT_FOUND_USER;

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

		// else-if가 아니어야 하는 것 아닌가?
		if (alarmOptOuts.contains(SLACK))
			slackAlarmSender.send(receiver, alarmEvent);
		if (alarmOptOuts.contains(EMAIL))
			emailAlarmSender.send(receiver, alarmEvent);
		if (alarmOptOuts.contains(PUSH))
			pushAlarmSender.send(receiver, alarmEvent);
	}
}
