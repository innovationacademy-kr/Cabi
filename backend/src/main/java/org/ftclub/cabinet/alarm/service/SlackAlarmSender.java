package org.ftclub.cabinet.alarm.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SlackAlarmSender {

    void send(User user, AlarmEvent alarmEvent) {
    }
}
