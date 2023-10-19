package org.ftclub.cabinet.alarm.slack.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SlackResponse {

    private final String ok;
    @JsonAlias("user")
    private final SlackUserInfo slackUserInfo;
}

