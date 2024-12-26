package org.ftclub.cabinet.alarm.slack.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class SlackProperties {

    private final String applicationForm = "application/x-www-form-urlencoded";
    private final String bearer = "Bearer ";

    @Value("${slack.token.singing-secret}")
    private String singingSecret;
    @Value("${slack.token.bot-token}")
    private String botToken;
    @Value("${slack.token.app-token}")
    private String appToken;
    @Value("${slack.channel.cabi}")
    private String cabiChannelId;
    @Value("${slack.channel.random}")
    private String randomChannelId;

}
