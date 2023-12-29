package org.ftclub.cabinet.alarm.handler;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.slack.api.Slack;
import java.time.LocalDateTime;
import java.util.Optional;
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
import org.ftclub.cabinet.alarm.dto.FCMDto;
import org.ftclub.cabinet.alarm.dto.SlackDto;
import org.ftclub.cabinet.alarm.slack.SlackApiManager;
import org.ftclub.cabinet.alarm.slack.dto.SlackUserInfo;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.thymeleaf.util.StringUtils;

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

		if (StringUtils.isEmpty(id)) {
			throw new ServiceException(ExceptionStatus.SLACK_ID_NOT_FOUND);
		}

		SlackDto slackDto = messageParse(alarmEvent.getAlarm());
		slackApiManager.sendMessage(id, slackDto.getContent());
	}

	private SlackDto messageParse(Alarm alarm) {
		log.debug("alarm = {}", alarm);
		if (alarm instanceof LentSuccessAlarm) {
			String building = ((LentSuccessAlarm) alarm).getLocation().getBuilding();
			Integer floor = ((LentSuccessAlarm) alarm).getLocation().getFloor();
			Integer visibleNum = ((LentSuccessAlarm) alarm).getVisibleNum();
			String body = String.format(alarmProperties.getLentSuccessSlackTemplate(),
					building + " " + floor + "층 " + visibleNum + "번");
			return new SlackDto(body);
		} else if (alarm instanceof LentExpirationImminentAlarm) {
			Long daysAfterFromExpireDate = ((LentExpirationImminentAlarm) alarm).getDaysAfterFromExpireDate();
			String body = String.format(alarmProperties.getSoonOverdueSlackTemplate(),
					Math.abs(daysAfterFromExpireDate));
			return new SlackDto(body);
		} else if (alarm instanceof LentExpirationAlarm) {
			Long daysLeftFromExpireDate = ((LentExpirationAlarm) alarm).getDaysLeftFromExpireDate();
			String body = String.format(alarmProperties.getOverdueSlackTemplate(),
					Math.abs(daysLeftFromExpireDate));
			return new SlackDto(body);
		} else if (alarm instanceof ExtensionIssuanceAlarm) {
			Integer daysToExtend = ((ExtensionIssuanceAlarm) alarm).getDaysToExtend();
			String extensionName = ((ExtensionIssuanceAlarm) alarm).getExtensionName();
			String body = String.format(alarmProperties.getExtensionIssuanceSlackTemplate(),
					daysToExtend, extensionName);
			return new SlackDto(body);
		} else if (alarm instanceof ExtensionExpirationImminentAlarm) {
			String extensionName = ((ExtensionExpirationImminentAlarm) alarm).getExtensionName();
			LocalDateTime extensionExpireDate = ((ExtensionExpirationImminentAlarm) alarm).getExtensionExpirationDate();
			String body = String.format(
					alarmProperties.getExtensionExpirationImminentSlackTemplate(),
					extensionName, extensionExpireDate);
			return new SlackDto(body);
		} else if (alarm instanceof AnnouncementAlarm) {
			String body = alarmProperties.getAnnouncementSlackTemplate();
			return new SlackDto(body);
		} else {
			throw new ServiceException(ExceptionStatus.NOT_FOUND_ALARM);
		}
	}


}
