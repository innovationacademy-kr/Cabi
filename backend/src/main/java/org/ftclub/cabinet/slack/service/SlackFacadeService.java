package org.ftclub.cabinet.slack.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.slack.SlackApiManager;
import org.ftclub.cabinet.alarm.slack.dto.SlackUserInfo;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.slack.dto.SlackMessageDto;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SlackFacadeService {

	private final SlackApiManager slackApiManager;
	private final UserQueryService userQueryService;

	public void sendSlackMessageToUser(SlackMessageDto slackMessageDto) {
		User user = userQueryService.getUserByName(slackMessageDto.getReceiverName());
		SlackUserInfo slackUserInfo = slackApiManager.requestSlackUserInfo(user.getEmail());
		String slackId = slackUserInfo.getId();
		if (slackId.isEmpty()) {
			throw ExceptionStatus.SLACK_ID_NOT_FOUND.asServiceException();
		}
		slackApiManager.sendMessage(slackId, slackMessageDto.getMessage());
	}

	public void sendSlackMessageToChannel(String channel, SlackMessageDto slackMessageDto) {
		slackApiManager.sendMessage(channel,
				slackMessageDto.getMessage());
	}
}
