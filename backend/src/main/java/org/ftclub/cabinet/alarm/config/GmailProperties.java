package org.ftclub.cabinet.alarm.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class GmailProperties {

	@Value("${cabinet.production}")
	private Boolean isProduction;

	@Value("${spring.mail.host}")
	private String mailServerHost;

	@Value("${spring.mail.port}")
	private int mailServerPort;

	@Value("${cabinet.alarm.mail.display-sender-name}")
	private String displaySenderName;

	@Value("${spring.mail.username}")
	private String username;

	@Value("${spring.mail.password}")
	private String password;

	@Value("${spring.mail.properties.mail.smtp.auth}")
	private Boolean useAuth;

	@Value("${spring.mail.properties.mail.smtp.starttls.enable}")
	private Boolean useStartTls;
}