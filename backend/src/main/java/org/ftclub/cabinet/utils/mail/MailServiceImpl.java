package org.ftclub.cabinet.utils.mail;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.GmailProperties;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Component;
import org.springframework.mail.javamail.JavaMailSender;

@Component
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private JavaMailSender mailSender;
    private GmailProperties gmailProperties;

    public void sendMail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(gmailProperties.getUsername());
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
