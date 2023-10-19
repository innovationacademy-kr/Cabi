package org.ftclub.cabinet.alarm.handler;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.config.AlarmProperties;
import org.ftclub.cabinet.alarm.domain.Alarm;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.AnnouncementAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionIssuanceAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.LentSuccessAlarm;
import org.ftclub.cabinet.alarm.fcm.FCMDto;
import org.ftclub.cabinet.alarm.fcm.FCMService;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PushAlarmSender {

	private final AlarmProperties alarmProperties;
	private final FCMService fcmService;

	void send(User user, AlarmEvent alarmEvent) {
		Alarm alarm = alarmEvent.getAlarm();
		FCMDto fcmDto = getFCMDto(alarm);
		fcmService.sendPushMessage(user.getName(), alarm, fcmDto);
	}

	private FCMDto getFCMDto(Alarm alarm) {
		if (alarm instanceof LentSuccessAlarm) {
			return new FCMDto(alarmProperties.getLentSuccessSubject(),
					alarmProperties.getLentSuccessFcmTemplate());
		} else if (alarm instanceof LentExpirationImminentAlarm) {
			return new FCMDto(alarmProperties.getSoonOverdueSubject(),
					alarmProperties.getSoonOverdueFcmTemplate());
		} else if (alarm instanceof LentExpirationAlarm) {
			return new FCMDto(alarmProperties.getOverdueSubject(),
					alarmProperties.getOverdueFcmTemplate());
		} else if (alarm instanceof ExtensionIssuanceAlarm) {
			return new FCMDto(alarmProperties.getExtensionIssuanceSubject(),
					alarmProperties.getExtensionIssuanceFcmTemplate());
		} else if (alarm instanceof ExtensionExpirationImminentAlarm) {
			return new FCMDto(alarmProperties.getExtensionExpirationImminentSubject(),
					alarmProperties.getExtensionExpirationImminentFcmTemplate());
		} else if (alarm instanceof AnnouncementAlarm) {
			return new FCMDto(alarmProperties.getAnnouncementSubject(),
					alarmProperties.getAnnouncementFcmTemplate());
		} else {
			throw new ServiceException(ExceptionStatus.NOT_FOUND_ALARM);
		}
	}
}
