package org.ftclub.cabinet.alarm.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.slack.SlackApiManager;
import org.ftclub.cabinet.alarm.slack.dto.SlackUserInfo;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Component;
import org.thymeleaf.util.StringUtils;

@Component
@RequiredArgsConstructor
public class SlackAlarmSender {

    private final SlackApiManager slackApiManager;

    void send(User user, AlarmEvent alarmEvent) {
        SlackUserInfo slackUserInfo = slackApiManager.requestSlackUserInfo(user.getEmail());
        String id = slackUserInfo.getId();
        if (StringUtils.isEmpty(id)) {
            throw new ServiceException(ExceptionStatus.SLACK_ID_NOT_FOUND);
        }

        slackApiManager.sendMessage(alarmEvent.getAlarm().toString(), id);
    }
}
