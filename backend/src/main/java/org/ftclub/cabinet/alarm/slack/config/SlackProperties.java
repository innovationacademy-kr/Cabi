package org.ftclub.cabinet.alarm.slack.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class SlackProperties {

    private final String authorization = "Authorization";
    private final String contentType = "CONTENT_TYPE";
    private final String applicationForm = "application/x-www-form-urlencoded";
    private final String bearer = "Bearer ";
    //    private final String SLACK_ERROR_MESSAGE = "Slack API Response Error";
//    private final String ERROR_RESPONSE = "error";
    private final String INTRA42_EMAIL_DOMAIN = "@student.42seoul.kr";

    @Value("${slack.token.singing-secret}")
    private String singingSecert;
    @Value("${slack.token.bot-token")
    private String botToken;
    @Value("${slack.token.app-token")
    private String appToken;
    @Value("${slack.channel.cabi")
    private String cabiChannelId;
    @Value("${slack.channel.ramdom")
    private String randomChannelId;

}
