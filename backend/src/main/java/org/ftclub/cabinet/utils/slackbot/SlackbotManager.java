package org.ftclub.cabinet.utils.slackbot;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.slack.api.Slack;
import com.slack.api.methods.MethodsClient;
import com.slack.api.methods.SlackApiException;
import com.slack.api.methods.request.chat.ChatPostMessageRequest;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.config.SlackBotProperties;
import org.ftclub.cabinet.dto.SlackResponse;
import org.ftclub.cabinet.dto.SlackUserInfo;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.UtilException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Log4j2
@EnableAsync
public class SlackbotManager {

	private final SlackBotProperties slackbotConfig;
	private final ObjectMapper objectMapper;

	private final String AUTHORIZATION = "Authorization";
	private final String CONTENT_TYPE = "CONTENT_TYPE";
	private final String APPLICATION_FORM = "application/x-www-form-urlencoded";
	private final String BEARER = "Bearer ";


	public SlackUserInfo requestSlackUserInfoByEmail(String intraId) {
		String url =
				slackbotConfig.getSlackFindUserUrl() + intraId + slackbotConfig.getIntraDomainUrl();

		HttpHeaders headers = new HttpHeaders();
		String slackToken = BEARER + slackbotConfig.getAppToken();
		headers.add(AUTHORIZATION, slackToken);
		headers.add(CONTENT_TYPE, APPLICATION_FORM);

		RestTemplate restTemplate = new RestTemplate();
		HttpEntity<String> request = new HttpEntity<>(headers);
		ResponseEntity<String> response = restTemplate.exchange(
				url,
				HttpMethod.GET,
				request,
				String.class
		);

		try {
			SlackResponse slackResponse = objectMapper.readValue(response.getBody(),
					SlackResponse.class);
			String status = slackResponse.getOk();
			if (status.equals("error") || status.equals("false")) {
				log.error("[Slack error] {} 슬랙 인증 에러", intraId);
				throw new UtilException(ExceptionStatus.SLACK_BAD_GATEWAY);
			} else if (slackResponse.getSlackUserInfo() == null) {
				log.error("[Slack error] {}  유저가 존재하지 않습니다.", intraId);
				throw new UtilException(ExceptionStatus.NOT_FOUND_USER);
			}
			return slackResponse.getSlackUserInfo();
		} catch (IOException e) {
			log.error("[Slack error] {} ", e.getMessage());
			throw new UtilException(ExceptionStatus.SLACK_BAD_GATEWAY);
		}
	}

	private String messageGenerator(Integer cabinetVisibleNum, LocalDateTime expiredAt) {
		return String.format("사물함 %s번 대여가 완료되었습니다.\n 만료일은 %s에 입니다.", cabinetVisibleNum,
				expiredAt.format(
						DateTimeFormatter.ofPattern("yyyy-MM-dd")));

	}

	@Async
	public void sendSlackMessage(String intraId, Integer cabinetVisibleNum,
			LocalDateTime expiredAt) {
		SlackUserInfo slackUserInfo = requestSlackUserInfoByEmail(intraId);
		String slackUserIdentifyId = slackUserInfo.getId();
		String message = messageGenerator(cabinetVisibleNum, expiredAt);

		try {
			MethodsClient methods = Slack.getInstance().methods(slackbotConfig.getAppToken());

			ChatPostMessageRequest request = ChatPostMessageRequest.builder()
					.channel(slackUserIdentifyId) // DM & channel
					.text(message)
					.build();
			methods.chatPostMessage(request);

			log.info("[Slack DM] {} 에 메시지 보냄", slackUserInfo.getName());
		} catch (SlackApiException | IOException e) {
			log.error("[Slack error] {} ", e.getMessage());
		}
	}
}
