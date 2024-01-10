package org.ftclub.cabinet.alarm.fcm;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.LentExpirationAlarm;
import org.ftclub.cabinet.alarm.handler.PushAlarmSender;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.alarm.fcm.service.FCMTokenRedisService;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/fcm")
@Logging
public class FCMTestController {
    private final FCMTokenRedisService fcmTokenRedisService;
    private final PushAlarmSender pushAlarmSender;

    @PostMapping("test/{name}/{token}")
    public void test(@PathVariable("name") String name, @PathVariable("token") String token) {
        fcmTokenRedisService.save(name, token, Duration.ofDays(1));
    }

    @PostMapping("test2/{name}")
    public void test2(@PathVariable("name") String name) {
        pushAlarmSender.send(
                User.of(name, name + "@studuent.42seoul.kr", null, UserRole.USER),
                AlarmEvent.of(1L, new LentExpirationAlarm(1L)));
    }
}
