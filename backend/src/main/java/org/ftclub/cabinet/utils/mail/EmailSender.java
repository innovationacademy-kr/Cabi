package org.ftclub.cabinet.utils.mail;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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

    public void sendMail(String name, String to, String subject, String template)
            throws MessagingException, MailException {
        log.info("called EmailSender for {}, {}, {}", name, to, subject);
        if (!gmailProperties.getIsProduction()) {
            log.info("개발 환경이므로 메일을 보내지 않습니다.");
            return;
        }
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(gmailProperties.getDisplaySenderName() + " <" + gmailProperties.getUsername()
                + ">");
        helper.setTo(to);
        helper.setSubject(subject);

        Context context = new Context();
        context.setVariable("name", name);

        String htmlContent = templateEngine.process(template, context);
        helper.setText(htmlContent, true);

        try {
            javaMailSender.send(message);
            log.info("{} ({})에게 메일을 성공적으로 보냈습니다.", name, to);
        } catch (MailException e) {
            log.error("메일 전송 중 오류가 발생했습니다: {}", e.getMessage());
        }
    }
}
