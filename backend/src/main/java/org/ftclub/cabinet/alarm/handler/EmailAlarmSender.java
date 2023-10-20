package org.ftclub.cabinet.alarm.handler;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.alarm.domain.Alarm;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.AnnouncementAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionIssuanceAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.LentSuccessAlarm;
import org.ftclub.cabinet.alarm.dto.MailDto;
import org.ftclub.cabinet.alarm.config.AlarmProperties;
import org.ftclub.cabinet.alarm.config.GmailProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.ITemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailAlarmSender {

	private final JavaMailSender javaMailSender;
	private final ITemplateEngine templateEngine;
	private final GmailProperties gmailProperties;
	private final AlarmProperties alarmProperties;

	public void send(User user, AlarmEvent alarmEvent) {
		log.info("Email Alarm Event : user = {}, alarmEvent = {}", user, alarmEvent);
		if (gmailProperties.getIsProduction() == false) {
			log.debug("개발 환경이므로 메일을 보내지 않습니다.");
			return;
		}
		MailDto mailDto = messageParse(user.getName(), alarmEvent.getAlarm());

		try {
			sendMessage(user.getEmail(), mailDto);
		} catch (MessagingException e) {
			throw new ServiceException(ExceptionStatus.MAIL_BAD_GATEWAY);
		}
	}

	private MailDto messageParse(String name, Alarm alarm) {
		Context context = new Context();
		context.setVariable("name", name);
		if (alarm instanceof LentSuccessAlarm) {
			LentSuccessAlarm lentSuccessAlarm = (LentSuccessAlarm) alarm;
			String building = lentSuccessAlarm.getLocation().getBuilding();
			Integer floor = lentSuccessAlarm.getLocation().getFloor();
			Integer visibleNum = lentSuccessAlarm.getVisibleNum();
			context.setVariable("location", building + " " + floor + "층 " + visibleNum + "번");
			context.setVariable("expireDate", lentSuccessAlarm.getLentExpirationDate());
			return new MailDto(alarmProperties.getLentSuccessSubject(),
					alarmProperties.getLentSuccessMailTemplateUrl(), context);
		}
		else if (alarm instanceof LentExpirationAlarm) {
			context.setVariable("expireDate",
					((LentExpirationAlarm) alarm).getDaysLeftFromExpireDate());
			return new MailDto(alarmProperties.getOverdueSubject(),
					alarmProperties.getOverdueMailTemplateUrl(), context);
		} else if (alarm instanceof LentExpirationImminentAlarm) {
			long overdueDays = ((LentExpirationImminentAlarm) alarm).getDaysAfterFromExpireDate();
			context.setVariable("overdueDays", overdueDays);
			return new MailDto(alarmProperties.getSoonOverdueSubject(),
					alarmProperties.getSoonOverdueMailTemplateUrl(), context);
		} else if (alarm instanceof ExtensionIssuanceAlarm) {
			context.setVariable("extensionName", ((ExtensionIssuanceAlarm) alarm).getExtensionName());
			context.setVariable("expireDate", ((ExtensionIssuanceAlarm) alarm).getExtensionExpirationDate());
			context.setVariable("daysToExtend", ((ExtensionIssuanceAlarm) alarm).getDaysToExtend());
			return new MailDto(alarmProperties.getExtensionIssuanceSubject(),
					alarmProperties.getExtensionIssuanceMailTemplateUrl(), context);
		} else if (alarm instanceof ExtensionExpirationImminentAlarm) {
			context.setVariable("extensionName", ((ExtensionExpirationImminentAlarm) alarm).getExtensionName());
			context.setVariable("expireDate", ((ExtensionExpirationImminentAlarm) alarm).getExtensionExpirationDate());
			return new MailDto(alarmProperties.getExtensionExpirationImminentSubject(),
					alarmProperties.getExtensionExpirationImminentMailTemplateUrl(), context);
		} else if (alarm instanceof AnnouncementAlarm) {
			context.setVariable("announcementContent", ((AnnouncementAlarm) alarm).getAnnouncementContent());
			return new MailDto(alarmProperties.getAnnouncementSubject(),
					alarmProperties.getAnnouncementMailTemplateUrl(), context);
		} else {
			throw new ServiceException(ExceptionStatus.NOT_FOUND_ALARM);
		}
	}

	private void sendMessage(String email, MailDto mailDto) throws MessagingException {
		log.info("send Message : email = {}, mailDto = {}", email, mailDto);
		MimeMessage message = javaMailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

		helper.setFrom(gmailProperties.getDisplaySenderName() + " <" + gmailProperties.getUsername() + ">");
		helper.setTo(email);
		helper.setSubject(mailDto.getSubject());

		String htmlContent = templateEngine.process(mailDto.getTemplate(), mailDto.getContext());
		helper.setText(htmlContent, true);

		javaMailSender.send(message);
	}
}
