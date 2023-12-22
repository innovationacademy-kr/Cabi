package org.ftclub.cabinet.alarm.handler;

import static org.ftclub.cabinet.exception.ExceptionStatus.NOT_FOUND_USER;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.config.AlarmProperties;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.TransactionalAlarmEvent;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.AlarmStatus;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Log4j2
public class AlarmEventHandler {

	private final UserRepository userRepository;
	private final SlackAlarmSender slackAlarmSender;
	private final EmailAlarmSender emailAlarmSender;
	private final PushAlarmSender pushAlarmSender;
	private final AlarmProperties alarmProperties;

	@TransactionalEventListener
	public void handleAlarmEventWithTransactional(TransactionalAlarmEvent transactionalAlarmEvent) {
		if (!alarmProperties.getIsProduction()) {
			return;
		}
		log.info("handleAlarmEventWithTransactional = {}", transactionalAlarmEvent);
		if (!(transactionalAlarmEvent instanceof TransactionalAlarmEvent)) {
			return;
		}
		AlarmEvent alarmEvent = (AlarmEvent) transactionalAlarmEvent;
		eventProceed(alarmEvent);
	}

	@EventListener
	public void handleAlarmEvent(AlarmEvent alarmEvent) {
		log.info("handleAlarmEvent = {}", alarmEvent);
		if (!alarmProperties.getIsProduction()) {
			return;
		}
		eventProceed(alarmEvent);
	}

	private void eventProceed(AlarmEvent alarmEvent) {
		User receiver = userRepository.findUserByIdWithAlarmStatus(alarmEvent.getReceiverId())
				.orElseThrow(() -> new ServiceException(NOT_FOUND_USER));
		AlarmStatus alarmStatus = receiver.getAlarmStatus();

		if (alarmStatus.isSlack()) {
			slackAlarmSender.send(receiver, alarmEvent);
		}
		if (alarmStatus.isEmail()) {
			emailAlarmSender.send(receiver, alarmEvent);
		}
		if (alarmStatus.isPush()) {
			pushAlarmSender.send(receiver, alarmEvent);
		}
	}
}
