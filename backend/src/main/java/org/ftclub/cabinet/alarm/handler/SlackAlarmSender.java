package org.ftclub.cabinet.alarm.handler;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.config.AlarmProperties;
import org.ftclub.cabinet.alarm.domain.Alarm;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.AnnouncementAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.ExtensionIssuanceAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationAlarm;
import org.ftclub.cabinet.alarm.domain.LentExpirationImminentAlarm;
import org.ftclub.cabinet.alarm.domain.LentSuccessAlarm;
import org.ftclub.cabinet.alarm.dto.SlackDto;
import org.ftclub.cabinet.alarm.slack.SlackApiManager;
import org.ftclub.cabinet.alarm.slack.dto.SlackUserInfo;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@RequiredArgsConstructor
public class SlackAlarmSender {

	private final SlackApiManager slackApiManager;
	private final AlarmProperties alarmProperties;

	@Async
	public void send(User user, AlarmEvent alarmEvent) {
		log.info("slack alarm Event : user = {}, alarmEvent = {}", user.getName(), alarmEvent);

		SlackUserInfo slackUserInfo = slackApiManager.requestSlackUserInfo(user.getEmail());
		String id = slackUserInfo.getId();

		if (id.isEmpty()) {
			throw ExceptionStatus.SLACK_ID_NOT_FOUND.asServiceException();
		}

		SlackDto slackDto = parseMessage(alarmEvent.getAlarm());
		slackApiManager.sendMessage(id, slackDto.getContent());
	}


	private SlackDto parseMessage(Alarm alarm) {
		log.debug("alarm = {}", alarm);
		if (alarm instanceof LentSuccessAlarm) {
			return generateLentSuccessAlarm((LentSuccessAlarm) alarm);
		} else if (alarm instanceof LentExpirationImminentAlarm) {
			return generateLentExpirationImminentAlarm((LentExpirationImminentAlarm) alarm);
		} else if (alarm instanceof LentExpirationAlarm) {
			return generateLentExpirationAlarm((LentExpirationAlarm) alarm);
		} else if (alarm instanceof ExtensionIssuanceAlarm) {
			return generateExtensionIssuanceAlarm((ExtensionIssuanceAlarm) alarm);
		} else if (alarm instanceof ExtensionExpirationImminentAlarm) {
			return generateExtensionExpirationImminent((ExtensionExpirationImminentAlarm) alarm);
		} else if (alarm instanceof AnnouncementAlarm) {
			return generateAnnouncementAlarm();
		} else {
			throw ExceptionStatus.NOT_FOUND_ALARM.asServiceException();
		}
	}

	private SlackDto generateLentSuccessAlarm(LentSuccessAlarm alarm) {
		String building = alarm.getLocation().getBuilding();
		Integer floor = alarm.getLocation().getFloor();
		Integer visibleNum = alarm.getVisibleNum();
		String body = String.format(alarmProperties.getLentSuccessSlackTemplate(),
				building + " " + floor + "층 " + visibleNum + "번");
		return new SlackDto(body);
	}

	private SlackDto generateLentExpirationImminentAlarm(LentExpirationImminentAlarm alarm) {
		Long daysAfterFromExpireDate = alarm.getDaysFromExpireDate();
		String body;
		if (alarm.isExpirationToday()) {
			body = alarmProperties.getSoonOverdueByTodayTemplate();
			return new SlackDto(body);
		}
		body = String.format(alarmProperties.getSoonOverdueSlackTemplate(),
				Math.abs(daysAfterFromExpireDate));
		return new SlackDto(body);
	}

	private SlackDto generateLentExpirationAlarm(LentExpirationAlarm alarm) {
		Long daysLeftFromExpireDate = alarm.getDaysFromExpireDate();
		String body = String.format(alarmProperties.getOverdueSlackTemplate(),
				Math.abs(daysLeftFromExpireDate));
		return new SlackDto(body);
	}

	private SlackDto generateExtensionIssuanceAlarm(ExtensionIssuanceAlarm alarm) {
		Integer daysToExtend = alarm.getDaysToExtend();
		String extensionName = alarm.getExtensionName();
		String body = String.format(alarmProperties.getExtensionIssuanceSlackTemplate(),
				daysToExtend, extensionName);
		return new SlackDto(body);
	}

	private SlackDto generateExtensionExpirationImminent(ExtensionExpirationImminentAlarm alarm) {
		String extensionName = alarm.getExtensionName();
		LocalDateTime extensionExpireDate = alarm.getExtensionExpirationDate();
		String body = String.format(
				alarmProperties.getExtensionExpirationImminentSlackTemplate(),
				extensionName, extensionExpireDate);
		return new SlackDto(body);
	}

	private SlackDto generateAnnouncementAlarm() {
		String body = alarmProperties.getAnnouncementSlackTemplate();
		return new SlackDto(body);
	}


}
