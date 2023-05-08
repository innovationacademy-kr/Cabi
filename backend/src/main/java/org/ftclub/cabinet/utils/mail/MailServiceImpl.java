package org.ftclub.cabinet.utils.mail;

import java.io.IOException;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.GmailProperties;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Component
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender emailSender;
    private final TemplateEngine templateEngine;
    private final GmailProperties gmailProperties;

    public void sendMail(String to, String subject, String template)
            throws MessagingException, IOException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(gmailProperties.getUsername());
        helper.setTo(to);
        helper.setSubject(subject);

        Context context = new Context();
        context.setVariable("username", to);

        String htmlContent = this.templateEngine.process(template, context);
        helper.setText(htmlContent, true);

        emailSender.send(message);
    }
}
