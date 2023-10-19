package org.ftclub.cabinet.alarm.service;

import javax.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.alarm.domain.Alarm;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.ExtensionExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionIssuanceAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.LentSuccessAlarm;
import org.ftclub.cabinet.alarm.mail.MailDto;
import org.ftclub.cabinet.alarm.mail.config.MailAlarmProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.alarm.mail.EmailSender;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailAlarmSender {

	private final EmailSender emailSender;
	private final MailAlarmProperties mailAlarmProperties;

	void send(User user, AlarmEvent alarmEvent) {
		Alarm alarm = alarmEvent.getAlarm();
		MailDto mailDto = getMailDto(alarm);
		try {
			emailSender.sendMail(user.getName(), user.getEmail(), mailDto.getSubject(),
					mailDto.getTemplate(), alarm);
			log.info("{} ({})에게 메일을 성공적으로 보냈습니다.", user.getName(), user.getEmail());
		} catch (MessagingException e) {
			log.error("메일 전송 중 오류가 발생했습니다: {}", e.getMessage());
			throw new ServiceException(ExceptionStatus.MAIL_BAD_GATEWAY);
		}
	}

	private MailDto getMailDto(Alarm alarm) {
		if (alarm instanceof LentSuccessAlarm) {
			return new MailDto(mailAlarmProperties.getSoonOverdueMailSubject(),
					mailAlarmProperties.getSoonOverdueMailTemplateUrl());
		}
		else if (alarm instanceof LentExpirationAlarm) {
			return new MailDto(mailAlarmProperties.getOverdueMailSubject(),
					mailAlarmProperties.getOverdueMailTemplateUrl());
		}
		else if (alarm instanceof LentExpirationImminentAlarm) {
			return new MailDto(mailAlarmProperties.getSoonOverdueMailSubject(),
					mailAlarmProperties.getSoonOverdueMailTemplateUrl());
		}
		else if (alarm instanceof ExtensionIssuanceAlarm) {
			return new MailDto(mailAlarmProperties.getExtensionIssuanceMailSubject(),
					mailAlarmProperties.getExtensionIssuanceMailTemplateUrl());
		}
		else if (alarm instanceof ExtensionExpirationImminentAlarm) {
			return new MailDto(mailAlarmProperties.getExtensionExpirationImminentMailSubject(),
					mailAlarmProperties.getExtensionExpirationImminentMailTemplateUrl());
		}
		else throw new ServiceException(ExceptionStatus.NOT_FOUND_ALARM);
	}
}
