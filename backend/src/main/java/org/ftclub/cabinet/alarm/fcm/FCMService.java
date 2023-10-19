package org.ftclub.cabinet.alarm.fcm;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import java.time.LocalDateTime;
import java.util.Formatter;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.alarm.domain.Alarm;
import org.ftclub.cabinet.alarm.domain.AnnouncementAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionIssuanceAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationImminentAlarm;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.redis.service.RedisService;
import org.ftclub.cabinet.utils.overdue.manager.OverdueType;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FCMService {
	private final RedisService redisService;
	private final DomainProperties domainProperties;
	private static final String ICON_FILE_PATH = "/src/assets/images/logo.svg";


	public void sendPushMessage(String name, Alarm alarm, FCMDto fcmDto) {
		log.info("called sendPushMessage name = {}, alarm = {}", name, alarm);

		Optional<String> token = redisService.findByKey(name, String.class);
		if (token.isEmpty()) {
			log.warn("\"{}\"에 해당하는 디바이스 토큰이 존재하지 않습니다.", name);
			return;
		}

		if (alarm instanceof LentExpirationImminentAlarm) {
			Long daysAfterFromExpireDate = ((LentExpirationImminentAlarm) alarm).getDaysAfterFromExpireDate();
			String title = fcmDto.getTitle();
			String body = String.format(fcmDto.getFormat(), Math.abs(daysAfterFromExpireDate));
			sendMessage(token.get(), name, title, body);
		} else if (alarm instanceof LentExpirationAlarm) {
			Long daysLeftFromExpireDate = ((LentExpirationAlarm) alarm).getDaysLeftFromExpireDate();
			String title = fcmDto.getTitle();
			String body = String.format(fcmDto.getFormat(), Math.abs(daysLeftFromExpireDate));
			sendMessage(token.get(), name, title, body);
		} else if (alarm instanceof ExtensionIssuanceAlarm) {
			Integer daysToExtend = ((ExtensionIssuanceAlarm) alarm).getDaysToExtend();
			String extensionName = ((ExtensionIssuanceAlarm) alarm).getExtensionName();
			String title = fcmDto.getTitle();
			String body = String.format(fcmDto.getFormat(), daysToExtend, extensionName);
			sendMessage(token.get(), name, title, body);
		} else if (alarm instanceof ExtensionExpirationImminentAlarm) {
			String extensionName = ((ExtensionExpirationImminentAlarm) alarm).getExtensionName();
			LocalDateTime extensionExpireDate = ((ExtensionExpirationImminentAlarm) alarm).getExtensionExpirationDate();
			String title = fcmDto.getTitle();
			String body = String.format(fcmDto.getFormat(), extensionName, extensionExpireDate);
			sendMessage(token.get(), name, title, body);
		} else if (alarm instanceof AnnouncementAlarm) {
			String title = fcmDto.getTitle();
			String body = fcmDto.getFormat();
			sendMessage(token.get(), name, title, body);
		} else {
			throw new ServiceException(ExceptionStatus.NOT_FOUND_ALARM);
		}
	}

	private void sendMessage(String token, String name, String title, String body) {
		log.info(
				"called sendOverdueMessage token = {}, name = {}, title = {}, body = {}",
				token, name, title, body);
		Message message = Message.builder()
				.putData("title", title)
				.putData("body", body)
				.putData("icon", domainProperties.getFeHost() + ICON_FILE_PATH)
				.putData("click_action", domainProperties.getFeHost())
				.setToken(token)
				.build();

		FirebaseMessaging.getInstance().sendAsync(message);
	}
}
