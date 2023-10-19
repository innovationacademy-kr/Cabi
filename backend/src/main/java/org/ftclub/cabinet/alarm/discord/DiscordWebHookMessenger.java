package org.ftclub.cabinet.alarm.discord;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Component
public class DiscordWebHookMessenger {
	private final static String DISCORD_WEBHOOK_MESSAGE_KEY = "content";
	private final String discordWebHookUrl;

	DiscordWebHookMessenger(@Value("${webhook.discord-admin}") String discordWebHookUrl) {
		this.discordWebHookUrl = discordWebHookUrl;
	}

	public void sendMessage(DiscordAlarmMessage message) {
		Map<String, String> body = new HashMap<>();
		body.put(DISCORD_WEBHOOK_MESSAGE_KEY, message.toString());

		WebClient.create().post()
				.uri(discordWebHookUrl)
				.bodyValue(body)
				.retrieve()
				.bodyToMono(String.class)
				.block();
	}
}
