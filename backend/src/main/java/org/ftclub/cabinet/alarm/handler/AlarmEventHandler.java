package org.ftclub.cabinet.alarm.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.TransactionalAlarmEvent;
import org.ftclub.cabinet.user.domain.AlarmStatus;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.newService.AlarmStatusQueryService;
import org.ftclub.cabinet.user.newService.UserQueryService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Log4j2
public class AlarmEventHandler {

	private final UserQueryService userQueryService;
	private final AlarmStatusQueryService alarmStatusQueryService;
	private final SlackAlarmSender slackAlarmSender;
	private final EmailAlarmSender emailAlarmSender;
	private final PushAlarmSender pushAlarmSender;

	@TransactionalEventListener
	public void handleAlarmEventWithTransactional(TransactionalAlarmEvent transactionalAlarmEvent) {
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
		eventProceed(alarmEvent);
	}

	private void eventProceed(AlarmEvent alarmEvent) {
		AlarmStatus alarmStatus =
				alarmStatusQueryService.getUserAlarmStatus(alarmEvent.getReceiverId());
		User receiver = alarmStatus.getUser();

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
