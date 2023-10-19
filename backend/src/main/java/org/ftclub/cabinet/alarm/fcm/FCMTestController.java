package org.ftclub.cabinet.alarm.fcm;

import java.time.Duration;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.ftclub.cabinet.alarm.domain.LentExpirationAlarm;
import org.ftclub.cabinet.redis.service.RedisService;
import org.ftclub.cabinet.utils.overdue.manager.OverdueType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/fcm")
@Log4j2
public class FCMTestController {
	private final RedisService redisService;
	private final FCMService fcmService;

	@PostMapping("test/{name}/{token}")
	public void test(@PathVariable("name") String name, @PathVariable("token") String token) {
		log.info("called test, name: {}, token: {}", name, token);
		redisService.save(name, token, Duration.ofDays(1));
	}

	@PostMapping("test2/{name}")
	public void test2(@PathVariable("name") String name) {
		log.info("called test2");
		LentExpirationAlarm alarm = new LentExpirationAlarm(1L);
		fcmService.sendPushMessage(name, alarm, new FCMDto("title", "%d"));
	}
}
