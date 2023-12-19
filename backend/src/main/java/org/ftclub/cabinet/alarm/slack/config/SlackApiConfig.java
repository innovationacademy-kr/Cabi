package org.ftclub.cabinet.alarm.slack.config;

import com.slack.api.Slack;
import com.slack.api.methods.MethodsClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SlackApiConfig {
	@Value("${slack.token.app-token}")
	private String appToken;

	@Bean
	public MethodsClient methodsClient() {
		return Slack.getInstance().methods(appToken);
	}
}
