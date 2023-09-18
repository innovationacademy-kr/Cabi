package org.ftclub.cabinet.log;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.DiscordAlarmMessage;
import org.ftclub.cabinet.alarm.DiscordWebHookMessenger;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class WebHookTestController {
	private final DiscordWebHookMessenger discordWebHookMessenger;
	private final LogParser logParser;

	@PostMapping("/test/discord")
	public void post(
			@RequestBody String log
	) {
		DiscordAlarmMessage discordAlarmMessage = logParser.parseToDiscordAlarmMessage(log);
		discordWebHookMessenger.sendMessage(discordAlarmMessage);
	}
}
