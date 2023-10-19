package org.ftclub.cabinet.alarm.mail;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.domain.Alarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.LentSuccessAlarm;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.config.GmailProperties;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.ITemplateEngine;
import org.thymeleaf.context.Context;

@Component
@RequiredArgsConstructor
@Log4j2
public class EmailSender {

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
			Location location = ((LentSuccessAlarm) alarm).getLocation();
			String locationString = location.getBuilding() + " "
					+ location.getFloor() + "층 " + location.getSection();
			context.setVariable("location", locationString);
			context.setVariable("expireDate", ((LentSuccessAlarm) alarm).getLentExpirationDate());
		}
		else if (alarm instanceof LentExpirationAlarm) {
			context.setVariable("expireDate",
					((LentExpirationAlarm) alarm).getDaysLeftFromExpireDate());
		} else if (alarm instanceof LentExpirationImminentAlarm) {
			long overdueDays = ((LentExpirationImminentAlarm) alarm).getDaysAfterFromExpireDate();
			context.setVariable("overdueDays", overdueDays);
		}

		String htmlContent = templateEngine.process(template, context);
		helper.setText(htmlContent, true);

		javaMailSender.send(message);
	}
}
