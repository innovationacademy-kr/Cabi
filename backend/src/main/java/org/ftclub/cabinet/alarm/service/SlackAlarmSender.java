package org.ftclub.cabinet.alarm.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.config.SlackProperties;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SlackAlarmSender {

    private final SlackProperties slackProperties;

    void send(AlarmEvent alarmEvent) {
    }
}
