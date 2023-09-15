package org.ftclub.cabinet.log;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class WebHookTestController {
	private final DiscordWebHookMessenger discordWebHookMessenger;

	@PostMapping("/test/discord")
	public void post(
			@RequestBody String message
	) {
		discordWebHookMessenger.sendMessage(message);
	}
}
