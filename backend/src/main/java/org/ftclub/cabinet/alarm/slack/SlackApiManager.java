package org.ftclub.cabinet.alarm.slack;

import feign.FeignException.FeignClientException;
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
                    slackProperties.getContentType(),
                    slackProperties.getBearer() + slackProperties.getAppToken(), email);
            String RESPONSE_ERROR_MSG = "error";
            if (slackResponse.getOk().equals(RESPONSE_ERROR_MSG)) {
                log.error("Slack Response ERROR Error {} ", slackResponse);
                throw new ServiceException(ExceptionStatus.NOT_FOUND_USER);
            }
            return slackResponse.getSlackUserInfo();
        } catch (FeignClientException e) {
            log.error("{}", e.getMessage());
            throw new ServiceException(ExceptionStatus.OAUTH_BAD_GATEWAY);
        }
    }

}
