package org.ftclub.cabinet.alarm.handler;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.slack.SlackApiManager;
import org.ftclub.cabinet.alarm.slack.dto.SlackUserInfo;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.stereotype.Component;
import org.thymeleaf.util.StringUtils;

@Component
@RequiredArgsConstructor
public class SlackAlarmSender {

	private final SlackApiManager slackApiManager;

	// 접근지정자가 없습니다.
	void send(User user, AlarmEvent alarmEvent) {
		SlackUserInfo slackUserInfo = slackApiManager.requestSlackUserInfo(user.getEmail());
		String id = slackUserInfo.getId();
		if (StringUtils.isEmpty(id)) {
			throw new ServiceException(ExceptionStatus.SLACK_ID_NOT_FOUND);
		}

		// toString을 이용하는 것이 아니라 직접적으로 메시지(String)으로 변환하는 메서드를 두는 게 좋을 것 같습니다.
		// 개인적인 느낌으로는 toString은 내부적으로 보는 내용이고, 메시지는 외부적으로 보는 내용 같은 느낌이라...
		// 이후에 작성하는 부분이 생길 때에도 toString을 override 하게하는 것 보다 인터페이스에서 명시적으로 강제하는게 좋을 것 같습니다.
		// 그리고 파라미터 뒤집혀있네요 id, alarm.toString()이어야 함
		slackApiManager.sendMessage(alarmEvent.getAlarm().toString(), id);
	}
}
