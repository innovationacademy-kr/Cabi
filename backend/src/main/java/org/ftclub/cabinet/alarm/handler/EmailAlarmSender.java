package org.ftclub.cabinet.alarm.handler;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.alarm.config.AlarmProperties;
import org.ftclub.cabinet.alarm.config.GmailProperties;
import org.ftclub.cabinet.alarm.domain.Alarm;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.AnnouncementAlarm;
import org.ftclub.cabinet.alarm.domain.AvailableSectionAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionIssuanceAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.LentSuccessAlarm;
import org.ftclub.cabinet.alarm.dto.MailDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.User;
import org.jetbrains.annotations.NotNull;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
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

	@Async
	public void send(User user, AlarmEvent alarmEvent) {
		log.info("Email Alarm Event : user = {}, alarmEvent = {}", user, alarmEvent);
		if (!gmailProperties.getIsProduction()) {
			log.debug("개발 환경이므로 메일을 보내지 않습니다.");
			return;
		}
		MailDto mailDto = parseMessageToMailDto(user.getName(), alarmEvent.getAlarm());

		try {
			sendMessage(user.getEmail(), mailDto);
		} catch (MessagingException e) {
			throw ExceptionStatus.MAIL_BAD_GATEWAY.asServiceException();
		}
	}

	private MailDto parseMessageToMailDto(String name, Alarm alarm) {
		Context context = new Context();
		context.setVariable("name", name);
		if (alarm instanceof LentSuccessAlarm) {
			return generateLentSuccessAlarm((LentSuccessAlarm) alarm, context);
		} else if (alarm instanceof LentExpirationAlarm) {
			return generateLentExpirationAlarm((LentExpirationAlarm) alarm, context);
		} else if (alarm instanceof LentExpirationImminentAlarm) {
			return generateLentExpirationImminentAlarm((LentExpirationImminentAlarm) alarm,
					context);
		} else if (alarm instanceof ExtensionIssuanceAlarm) {
			return generateExtensionIssuanceAlarm((ExtensionIssuanceAlarm) alarm, context);
		} else if (alarm instanceof ExtensionExpirationImminentAlarm) {
			return generateExtensionExpirationImminentAlarm(
					(ExtensionExpirationImminentAlarm) alarm, context);
		} else if (alarm instanceof AnnouncementAlarm) {
			return generateAnnouncementAlarm((AnnouncementAlarm) alarm, context);
		} else if (alarm instanceof AvailableSectionAlarm) {
			return generateSectionAlarm((AvailableSectionAlarm) alarm, context);
		} else {
			throw ExceptionStatus.NOT_FOUND_ALARM.asServiceException();
		}
	}

	@NotNull
	private MailDto generateAnnouncementAlarm(AnnouncementAlarm alarm, Context context) {
		context.setVariable("announcementContent", alarm.getAnnouncementContent());
		return new MailDto(alarmProperties.getAnnouncementSubject(),
				alarmProperties.getAnnouncementMailTemplateUrl(), context);
	}

	@NotNull
	private MailDto generateExtensionExpirationImminentAlarm(ExtensionExpirationImminentAlarm alarm,
			Context context) {
		context.setVariable("extensionName", alarm.getExtensionName());
		context.setVariable("expireDate", alarm.getExtensionExpirationDate());
		return new MailDto(alarmProperties.getExtensionExpirationImminentSubject(),
				alarmProperties.getExtensionExpirationImminentMailTemplateUrl(), context);
	}

	@NotNull
	private MailDto generateExtensionIssuanceAlarm(ExtensionIssuanceAlarm alarm, Context context) {
		context.setVariable("extensionName", alarm.getExtensionName());
		context.setVariable("expireDate", alarm.getExtensionExpirationDate());
		context.setVariable("daysToExtend", alarm.getDaysToExtend());
		return new MailDto(alarmProperties.getExtensionIssuanceSubject(),
				alarmProperties.getExtensionIssuanceMailTemplateUrl(), context);
	}

	@NotNull
	private MailDto generateLentExpirationImminentAlarm(LentExpirationImminentAlarm alarm,
			Context context) {
		String expirationDate = alarm.getExpirationDateAsString();
		context.setVariable("expireDate", expirationDate);
		return new MailDto(alarmProperties.getSoonOverdueSubject(),
				alarmProperties.getSoonOverdueMailTemplateUrl(), context);
	}

	@NotNull
	private MailDto generateLentExpirationAlarm(LentExpirationAlarm alarm, Context context) {
		context.setVariable("expireDate", alarm.getDaysFromExpireDate());
		return new MailDto(alarmProperties.getOverdueSubject(),
				alarmProperties.getOverdueMailTemplateUrl(), context);
	}

	@NotNull
	private MailDto generateLentSuccessAlarm(LentSuccessAlarm alarm, Context context) {
		String building = alarm.getLocation().getBuilding();
		Integer floor = alarm.getLocation().getFloor();
		Integer visibleNum = alarm.getVisibleNum();
		context.setVariable("location", building + " " + floor + "층 " + visibleNum + "번");
		context.setVariable("expireDate", alarm.getLentExpirationDate());
		return new MailDto(alarmProperties.getLentSuccessSubject(),
				alarmProperties.getLentSuccessMailTemplateUrl(), context);
	}

	@NotNull
	private MailDto generateSectionAlarm(AvailableSectionAlarm alarm, Context context) {
		String building = alarm.getLocation().getBuilding();
		Integer floor = alarm.getLocation().getFloor();
		String section = alarm.getLocation().getSection();
		context.setVariable("location", building + " " + floor + "층 " + section + "구역");
		return new MailDto(alarmProperties.getSectionAlarmSubject(),
				alarmProperties.getSectionAlarmMailTemplateUrl(), context);
	}

	private void sendMessage(String email, MailDto mailDto) throws MessagingException {
		log.info("send Message : email = {}, mailDto = {}", email, mailDto);
		MimeMessage message = javaMailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

		helper.setFrom(gmailProperties.getDisplaySenderName() +
				" <" + gmailProperties.getUsername() + ">");
		helper.setTo(email);
		helper.setSubject(mailDto.getSubject());

		String htmlContent = templateEngine.process(mailDto.getTemplate(), mailDto.getContext());
		helper.setText(htmlContent, true);

		javaMailSender.send(message);
	}
}
