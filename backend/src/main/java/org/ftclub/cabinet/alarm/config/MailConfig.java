package org.ftclub.cabinet.alarm.config;

import java.util.Properties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {

	@Bean
	public JavaMailSender javaMailSender(GmailProperties gmailProperties) {
		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setHost("smtp.gmail.com");
		mailSender.setUsername(gmailProperties.getUsername());
		mailSender.setPassword(gmailProperties.getPassword());

		Properties props = mailSender.getJavaMailProperties();
		props.put("mail.smtp.timeout", "5000");
		props.put("mail.smtp.connectiontimeout", "5000");
		props.put("mail.smtp.writetimeout", "5000");
		props.put("mail.smtp.retrycount", "1");

		return mailSender;
	}

}
