package org.ftclub.cabinet.slack.controller;

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.slack.dto.SlackMessageDto;
import org.ftclub.cabinet.slack.service.SlackFacadeService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Logging
@RestController
@RequestMapping("/slack")
@RequiredArgsConstructor
public class SlackController {

	private final SlackFacadeService slackFacadeService;


	@PostMapping("/send")
	@AuthGuard(level = ADMIN_ONLY)
	public void send(@RequestBody SlackMessageDto slackMessageDto) {
		slackFacadeService.sendSlackMessageToUser(slackMessageDto);
	}

	@PostMapping("/send/{channel}")
	@AuthGuard(level = ADMIN_ONLY)
	public void send(@PathVariable String channel, @RequestBody SlackMessageDto slackMessageDto) {
		slackFacadeService.sendSlackMessageToChannel(channel, slackMessageDto);
	}

}

