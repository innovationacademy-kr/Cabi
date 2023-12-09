package org.ftclub.cabinet.alarm.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class GmailProperties {

	@Value("${spring.production}")
	private Boolean isProduction;

	@Value("${alarm.mail.host}")
	private String mailServerHost;

	@Value("${alarm.mail.port}")
	private int mailServerPort;

	@Value("${alarm.mail.display-sender-name}")
	private String displaySenderName;

	@Value("${alarm.mail.username}")
	private String username;

	@Value("${alarm.mail.password}")
	private String password;

	@Value("${alarm.mail.properties.mail.smtp.auth}")
	private Boolean useAuth;

	@Value("${alarm.mail.properties.mail.smtp.starttls.enable}")
	private Boolean useStartTls;
}