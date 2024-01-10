package org.ftclub.cabinet.alarm.fcm.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class FirebaseConfig {

	@Value("${firebase.messaging.credentials.path}")
	private String credentialsPath;

	@Value("${firebase.messaging.device-token-expiry-days}")
	private Integer deviceTokenExpiryDays;
}
