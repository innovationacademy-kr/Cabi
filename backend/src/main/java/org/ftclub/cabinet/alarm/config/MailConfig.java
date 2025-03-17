package org.ftclub.cabinet.alarm.config;

import java.util.Properties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

/**
 * javaMailSender 에 대한 설정
 * <p>
 * smtp gmail 사용, 타임아웃 5초, 재발송 1회 제한
 */
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
