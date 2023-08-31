package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class SlackBotProperties {

	@Value("${spring.slack.token.singing-secret}")
	private String singingSecret;

	@Value("${spring.slack.token.bot-token}")
	private String botToken;

	@Value("${spring.slack.token.app-token}")
	private String appToken;

	@Value("${spring.slack.token.channel}")
	private String channelId;

	@Value("${spring.slack.urls.slack-find-user}")
	private String slackFindUserUrl;

	@Value("${spring.slack.urls.intra-email-domain}")
	private String intraDomainUrl;

}
