package org.ftclub.cabinet.utils.mail;

import java.io.IOException;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.config.GmailProperties;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Component
@RequiredArgsConstructor
@Log4j2
public class EmailSender {

	private final JavaMailSender emailSender;
	private final TemplateEngine templateEngine;
	private final GmailProperties gmailProperties;

	public void sendMail(String name, String to, String subject, String template)
			throws MessagingException, IOException {
		log.info("called EmailSender for {}, {}, {}", name, to, subject);
		if (gmailProperties.getIsProduction() == false) {
			log.info("개발 환경이므로 메일을 보내지 않습니다.");
			return;
		}
		MimeMessage message = emailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

		helper.setFrom(gmailProperties.getUsername());
		helper.setTo(to);
		helper.setSubject(subject);

		Context context = new Context();
		context.setVariable("name", name);

		String htmlContent = this.templateEngine.process(template, context);
		helper.setText(htmlContent, true);

		emailSender.send(message);
		log.info("{} ({}) 에게 메일을 성공적으로 보냈습니다.", name, to);
	}
}
