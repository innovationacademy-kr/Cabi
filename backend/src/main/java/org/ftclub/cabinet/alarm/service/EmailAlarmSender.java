package org.ftclub.cabinet.alarm.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.config.MailOverdueProperties;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.utils.mail.EmailSender;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailAlarmSender {

	private final EmailSender emailSender;
	private final MailOverdueProperties mailOverdueProperties;

	void send(User user, AlarmEvent alarmEvent) {
		String subject = mailOverdueProperties.getSoonOverdueMailSubject();
		String template = mailOverdueProperties.getSoonOverdueMailTemplateUrl();
//		emailSender.sendMail(activeLent.getName(), activeLent.getEmail(), subject, template);
	}
}
