package org.ftclub.cabinet.alarm.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.alarm.config.AlarmProperties;
import org.ftclub.cabinet.alarm.config.GmailProperties;
import org.ftclub.cabinet.alarm.domain.*;
import org.ftclub.cabinet.alarm.dto.MailDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.thymeleaf.ITemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

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
		if (gmailProperties.getIsProduction() == false) {
			log.debug("개발 환경이므로 메일을 보내지 않습니다.");
			return;
		}
		MailDto mailDto = parseMessageToMailDto(user.getName(), alarmEvent.getAlarm());

		try {
			sendMessage(user.getEmail(), mailDto);
		} catch (MessagingException e) {
			throw new ServiceException(ExceptionStatus.MAIL_BAD_GATEWAY);
		}
	}

	private MailDto parseMessageToMailDto(String name, Alarm alarm) {
		Context context = new Context();
		context.setVariable("name", name);
		// private으로 각 알람별 메서드를 만들어서 호출하는 것이 좋을 것 같습니다.
		// 지금 보니 기본적인 컨텐츠들 - 제목, 내용은 다른 sender에서도 동일하게 사용하는 경우가 많은 것 같은데,
		// 이 부분을 Alarm 자체에서 toString과 같은 역할을 하는 템플리팅 메서드가 있으면 좋을 것 같습니다.
		// 혹 각 sender별로 커스텀한 방식이 필요하다면 Alarm 자체에 각 알람에 맞게 구현되도록 하는 메서드를 갖게할 수도 있을 것 같습니다.
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
		// 상속되는 것이 아닌 한 instanceof로 else는 필요 없지 않나요?
		else if (alarm instanceof LentExpirationAlarm) {
			context.setVariable("expireDate",
					((LentExpirationAlarm) alarm).getDaysLeftFromExpireDate());
			return new MailDto(alarmProperties.getOverdueSubject(),
					alarmProperties.getOverdueMailTemplateUrl(), context);
		} else if (alarm instanceof LentExpirationImminentAlarm) {
			String expirationDate = ((LentExpirationImminentAlarm) alarm).getExpirationDate();
			context.setVariable("expireDate", expirationDate);
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
