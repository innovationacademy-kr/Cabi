package org.ftclub.cabinet.alarm.mail;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.domain.Alarm;
import org.ftclub.cabinet.alarm.domain.AnnouncementAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionIssuanceAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.LentSuccessAlarm;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.alarm.mail.config.GmailProperties;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.ITemplateEngine;
import org.thymeleaf.context.Context;

@Component
@RequiredArgsConstructor
@Log4j2
public class EmailService {

	private final JavaMailSender javaMailSender;
	private final ITemplateEngine templateEngine;
	private final GmailProperties gmailProperties;

	public void sendMail(String name, String to, String subject, String template, Alarm alarm)
			throws MessagingException, MailException {
		log.info("called EmailSender for {}, {}, {}", name, to, subject);
		if (gmailProperties.getIsProduction() == false) {
			log.debug("개발 환경이므로 메일을 보내지 않습니다.");
			return;
		}
		MimeMessage message = javaMailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

		helper.setFrom(gmailProperties.getDisplaySenderName() + " <" + gmailProperties.getUsername() + ">");
		helper.setTo(to);
		helper.setSubject(subject);

		Context context = new Context();
		context.setVariable("name", name);
		if (alarm instanceof LentSuccessAlarm) {
			String building = ((LentSuccessAlarm) alarm).getLocation().getBuilding();
			Integer floor = ((LentSuccessAlarm) alarm).getLocation().getFloor();
			Integer visibleNum = ((LentSuccessAlarm) alarm).getVisibleNum();
			context.setVariable("location", building + " " + floor + "층 " + visibleNum + "번");
			context.setVariable("expireDate", ((LentSuccessAlarm) alarm).getLentExpirationDate());
		}
		else if (alarm instanceof LentExpirationAlarm) {
			context.setVariable("expireDate",
					((LentExpirationAlarm) alarm).getDaysLeftFromExpireDate());
		} else if (alarm instanceof LentExpirationImminentAlarm) {
			long overdueDays = ((LentExpirationImminentAlarm) alarm).getDaysAfterFromExpireDate();
			context.setVariable("overdueDays", overdueDays);
		} else if (alarm instanceof ExtensionIssuanceAlarm) {
			context.setVariable("extensionName", ((ExtensionIssuanceAlarm) alarm).getExtensionName());
			context.setVariable("expireDate", ((ExtensionIssuanceAlarm) alarm).getExtensionExpirationDate());
			context.setVariable("daysToExtend", ((ExtensionIssuanceAlarm) alarm).getDaysToExtend());
		} else if (alarm instanceof ExtensionExpirationImminentAlarm) {
			context.setVariable("extensionName", ((ExtensionExpirationImminentAlarm) alarm).getExtensionName());
			context.setVariable("expireDate", ((ExtensionExpirationImminentAlarm) alarm).getExtensionExpirationDate());
		} else if (alarm instanceof AnnouncementAlarm) {
			context.setVariable("announcementContent", ((AnnouncementAlarm) alarm).getAnnouncementContent());
		}

		String htmlContent = templateEngine.process(template, context);
		helper.setText(htmlContent, true);

		javaMailSender.send(message);
	}
}
