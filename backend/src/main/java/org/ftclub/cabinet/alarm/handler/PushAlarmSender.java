package org.ftclub.cabinet.alarm.handler;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.config.AlarmProperties;
import org.ftclub.cabinet.alarm.domain.*;
import org.ftclub.cabinet.alarm.dto.FCMDto;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.alarm.fcm.service.FCMTokenRedisService;
import org.ftclub.cabinet.user.domain.User;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Log4j2
@Component
@RequiredArgsConstructor
public class PushAlarmSender {

	private static final String ICON_FILE_PATH = "/src/assets/images/logo.svg";
	private final AlarmProperties alarmProperties;
	private final FCMTokenRedisService fcmTokenRedisService;
	private final DomainProperties domainProperties;

	public void send(User user, AlarmEvent alarmEvent) {
		log.info("push alarm Event : user = {}, alarmEvent = {}", user, alarmEvent);

		Optional<String> token = fcmTokenRedisService.findByUserName(user.getName());
		if (token.isEmpty()) {
			log.warn("\"{}\"에 해당하는 디바이스 토큰이 존재하지 않습니다.", user.getName());
			return;
		}

		FCMDto fcmDto = parseMessage(alarmEvent.getAlarm());
		sendMessage(token.get(), fcmDto);
	}

	private FCMDto parseMessage(Alarm alarm) {
		if (alarm instanceof LentSuccessAlarm) {
			return generateLentSuccessAlarm((LentSuccessAlarm) alarm);
		} else if (alarm instanceof LentExpirationImminentAlarm) {
			return generateLentExpirationImminentAlarm((LentExpirationImminentAlarm) alarm);
		} else if (alarm instanceof LentExpirationAlarm) {
			return generateLentExpirationAlarm((LentExpirationAlarm) alarm);
		} else if (alarm instanceof ExtensionIssuanceAlarm) {
			return generateExtensionIssuanceAlarm((ExtensionIssuanceAlarm) alarm);
		} else if (alarm instanceof ExtensionExpirationImminentAlarm) {
			return generateExtensionExpirationImminentAlarm((ExtensionExpirationImminentAlarm) alarm);
		} else if (alarm instanceof AnnouncementAlarm) {
			return generateAnnouncementAlarm();
		} else {
			throw ExceptionStatus.NOT_FOUND_ALARM.asServiceException();
		}
	}

	@NotNull
	private FCMDto generateAnnouncementAlarm() {
		String title = alarmProperties.getAnnouncementSubject();
		String body = alarmProperties.getAnnouncementMailTemplateUrl();
		return new FCMDto(title, body);
	}

	@NotNull
	private FCMDto generateExtensionExpirationImminentAlarm(ExtensionExpirationImminentAlarm alarm) {
		String extensionName = alarm.getExtensionName();
		LocalDateTime extensionExpireDate = alarm.getExtensionExpirationDate();
		String title = alarmProperties.getExtensionExpirationImminentSubject();
		String body = String.format(alarmProperties.getExtensionExpirationImminentMailTemplateUrl(),
				extensionName, extensionExpireDate);
		return new FCMDto(title, body);
	}

	@NotNull
	private FCMDto generateExtensionIssuanceAlarm(ExtensionIssuanceAlarm alarm) {
		Integer daysToExtend = alarm.getDaysToExtend();
		String extensionName = alarm.getExtensionName();
		String title = alarmProperties.getExtensionIssuanceSubject();
		String body = String.format(alarmProperties.getExtensionIssuanceMailTemplateUrl(),
				daysToExtend, extensionName);
		return new FCMDto(title, body);
	}

	@NotNull
	private FCMDto generateLentExpirationAlarm(LentExpirationAlarm alarm) {
		Long daysLeftFromExpireDate = alarm.getDaysLeftFromExpireDate();
		String title = alarmProperties.getOverdueSubject();
		String body = String.format(alarmProperties.getOverdueFcmTemplate(),
				Math.abs(daysLeftFromExpireDate));
		return new FCMDto(title, body);
	}

	@NotNull
	private FCMDto generateLentExpirationImminentAlarm(LentExpirationImminentAlarm alarm) {
		Long daysAfterFromExpireDate = alarm.getDaysAfterFromExpireDate();
		String title = alarmProperties.getSoonOverdueSubject();
		String body = String.format(alarmProperties.getSoonOverdueFcmTemplate(),
				Math.abs(daysAfterFromExpireDate));
		return new FCMDto(title, body);
	}

	@NotNull
	private FCMDto generateLentSuccessAlarm(LentSuccessAlarm alarm) {
		String building = alarm.getLocation().getBuilding();
		Integer floor = alarm.getLocation().getFloor();
		Integer visibleNum = alarm.getVisibleNum();
		String title = alarmProperties.getLentSuccessSubject();
		String body = String.format(alarmProperties.getLentSuccessFcmTemplate(),
				building + " " + floor + "층 " + visibleNum + "번");
		return new FCMDto(title, body);
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
