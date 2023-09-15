package org.ftclub.cabinet.log;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class DiscordWebHookMessenger {
	private final String discordWebHookUrl;

	DiscordWebHookMessenger(@Value("${webhook.discord-admin}") String discordWebHookUrl) {
		this.discordWebHookUrl = discordWebHookUrl;
	}

	public void sendMessage(String message) {
		WebClient.create().post()
				.uri(discordWebHookUrl)
				.bodyValue(message)
				.retrieve()
				.bodyToMono(String.class)
				.block();
	}
}
