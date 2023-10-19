package org.ftclub.cabinet.alarm.slack;

import com.slack.api.Slack;
import com.slack.api.methods.MethodsClient;
import com.slack.api.methods.SlackApiException;
import com.slack.api.methods.request.chat.ChatPostMessageRequest;
import feign.FeignException.FeignClientException;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.slack.config.SlackProperties;
import org.ftclub.cabinet.alarm.slack.dto.SlackResponse;
import org.ftclub.cabinet.alarm.slack.dto.SlackUserInfo;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class SlackApiManager {

    private final SlackProperties slackProperties;
    private final SlackFeignClient slackFeignClient;

    public SlackUserInfo requestSlackUserInfo(String email) {

        log.info("Called requestSlackUserInfo email={}", email);

        try {
            SlackResponse slackResponse = slackFeignClient.getUserInfoByEmail(
                    slackProperties.getApplicationForm(),
                    slackProperties.getBearer() + slackProperties.getAppToken(),
                    email);

            String RESPONSE_ERROR_MSG = "error";
            if (slackResponse.getOk().equals(RESPONSE_ERROR_MSG)) {
                log.error("Slack Response ERROR Error {} ", slackResponse);
                throw new ServiceException(ExceptionStatus.SLACK_ID_NOT_FOUND);
            }

            return slackResponse.getSlackUserInfo();
        } catch (FeignClientException e) {
            log.error("{}", e.getMessage());
            throw new ServiceException(ExceptionStatus.SLACK_REQUEST_BAD_GATEWAY);
        }
    }

    public void sendMessage(String channelId, String message) {
        log.info("Called sendMessage channelId={}, message={}", channelId, message);
        try {
            MethodsClient methods = Slack.getInstance().methods(slackProperties.getAppToken());

            ChatPostMessageRequest request = ChatPostMessageRequest.builder()
                    .channel(channelId) // DM & channel
                    .text(message)
                    .build();
            methods.chatPostMessage(request);
        } catch (SlackApiException | IOException e) {
            log.error("{}", e.getMessage());
            throw new ServiceException(ExceptionStatus.SLACK_MESSAGE_SEND_BAD_GATEWAY);
        }
    }
}
