package org.ftclub.cabinet.alarm.handler;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import java.time.LocalDateTime;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.alarm.config.AlarmProperties;
import org.ftclub.cabinet.alarm.domain.Alarm;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.AnnouncementAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionIssuanceAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.LentSuccessAlarm;
import org.ftclub.cabinet.alarm.dto.FCMDto;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.redis.service.RedisService;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PushAlarmSender {

	private final AlarmProperties alarmProperties;
	private final RedisService redisService;
	private final DomainProperties domainProperties;
	private static final String ICON_FILE_PATH = "/src/assets/images/logo.svg";

	public void send(User user, AlarmEvent alarmEvent) {
		log.info("push alarm Event : user = {}, alarmEvent = {}", user, alarmEvent);

		Optional<String> token = redisService.findByKey(user.getName(), String.class);
		if (token.isEmpty()) {
			log.warn("\"{}\"에 해당하는 디바이스 토큰이 존재하지 않습니다.", user.getName());
			return;
		}

		FCMDto fcmDto = messageParse(alarmEvent.getAlarm());
		sendMessage(token.get(), fcmDto);
	}

	private FCMDto messageParse(Alarm alarm) {
		if (alarm instanceof LentSuccessAlarm) {
			String building = ((LentSuccessAlarm) alarm).getLocation().getBuilding();
			Integer floor = ((LentSuccessAlarm) alarm).getLocation().getFloor();
			Integer visibleNum = ((LentSuccessAlarm) alarm).getVisibleNum();
			String title = alarmProperties.getLentSuccessSubject();
			String body = String.format(alarmProperties.getLentSuccessMailTemplateUrl(),
					building + " " + floor + "층 " + visibleNum + "번");
			return new FCMDto(title, body);
		} else if (alarm instanceof LentExpirationImminentAlarm) {
			Long daysAfterFromExpireDate = ((LentExpirationImminentAlarm) alarm).getDaysAfterFromExpireDate();
			String title = alarmProperties.getSoonOverdueSubject();
			String body = String.format(alarmProperties.getSoonOverdueFcmTemplate(),
					Math.abs(daysAfterFromExpireDate));
			return new FCMDto(title, body);
		} else if (alarm instanceof LentExpirationAlarm) {
			Long daysLeftFromExpireDate = ((LentExpirationAlarm) alarm).getDaysLeftFromExpireDate();
			String title = alarmProperties.getOverdueSubject();
			String body = String.format(alarmProperties.getOverdueFcmTemplate(),
					Math.abs(daysLeftFromExpireDate));
			return new FCMDto(title, body);
		} else if (alarm instanceof ExtensionIssuanceAlarm) {
			Integer daysToExtend = ((ExtensionIssuanceAlarm) alarm).getDaysToExtend();
			String extensionName = ((ExtensionIssuanceAlarm) alarm).getExtensionName();
			String title = alarmProperties.getExtensionIssuanceSubject();
			String body = String.format(alarmProperties.getExtensionIssuanceMailTemplateUrl(),
					daysToExtend, extensionName);
			return new FCMDto(title, body);
		} else if (alarm instanceof ExtensionExpirationImminentAlarm) {
			String extensionName = ((ExtensionExpirationImminentAlarm) alarm).getExtensionName();
			LocalDateTime extensionExpireDate = ((ExtensionExpirationImminentAlarm) alarm).getExtensionExpirationDate();
			String title = alarmProperties.getExtensionExpirationImminentSubject();
			String body = String.format(alarmProperties.getExtensionExpirationImminentMailTemplateUrl(),
					extensionName, extensionExpireDate);
			return new FCMDto(title, body);
		} else if (alarm instanceof AnnouncementAlarm) {
			String title = alarmProperties.getAnnouncementSubject();
			String body = alarmProperties.getAnnouncementMailTemplateUrl();
			return new FCMDto(title, body);
		} else {
			throw new ServiceException(ExceptionStatus.NOT_FOUND_ALARM);
		}
	}

	private void sendMessage(String token, FCMDto fcmDto) {
		log.info("send Message : token = {}, fcmDto = {}", token, fcmDto);
		Message message = Message.builder()
				.putData("title", fcmDto.getTitle())
				.putData("body", fcmDto.getBody())
				.putData("icon", domainProperties.getFeHost() + ICON_FILE_PATH)
				.putData("click_action", domainProperties.getFeHost())
				.setToken(token)
				.build();
		FirebaseMessaging.getInstance().sendAsync(message);
	}
}
