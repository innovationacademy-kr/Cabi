package org.ftclub.cabinet.alarm.slack;

import com.slack.api.methods.MethodsClient;
import com.slack.api.methods.SlackApiException;
import com.slack.api.methods.request.chat.ChatPostMessageRequest;
import feign.FeignException.FeignClientException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.slack.config.SlackProperties;
import org.ftclub.cabinet.alarm.slack.dto.SlackResponse;
import org.ftclub.cabinet.alarm.slack.dto.SlackUserInfo;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Log4j2
@Service
@RequiredArgsConstructor
public class SlackApiManager {

	private final SlackProperties slackProperties;
	private final SlackFeignClient slackFeignClient;
	private final MethodsClient slackApi;

	/**
	 * email 주소로, Slack 고유 ID를 가져옵니다.
	 *
	 * @param email
	 * @return
	 */
	public SlackUserInfo requestSlackUserInfo(String email) {
		log.info("Called requestSlackUserInfo email={}", email);
		try {
			SlackResponse slackResponse = slackFeignClient.getUserInfoByEmail(
					slackProperties.getApplicationForm(),
					slackProperties.getBearer() + slackProperties.getAppToken(),
					email);
			slackResponse.responseCheck();
			return slackResponse.getSlackUserInfo();
		} catch (FeignClientException e) {
			log.error("{}", e.getMessage());
			throw ExceptionStatus.SLACK_REQUEST_BAD_GATEWAY.asServiceException();
		}
	}

	public void sendMessage(String channelId, String message) {
		log.info("Called sendMessage channelId={}, message={}", channelId, message);
		try {
			ChatPostMessageRequest request = ChatPostMessageRequest.builder()
					.channel(channelId) // DM & channel
					.text(message)
					.build();
			slackApi.chatPostMessage(request);

		} catch (SlackApiException | IOException e) {
			log.error("{}", e.getMessage());
			throw ExceptionStatus.SLACK_MESSAGE_SEND_BAD_GATEWAY.asServiceException();
		}
	}
}
