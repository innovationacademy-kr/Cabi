package org.ftclub.cabinet.alarm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.ftclub.cabinet.user.domain.AlarmStatus;

@AllArgsConstructor
@Getter
public class AlarmTypeResponseDto {

	private boolean slack;
	private boolean email;
	private boolean push;

	@Builder
	public AlarmTypeResponseDto(AlarmStatus alarmStatus) {
		this.slack = alarmStatus.isSlack();
		this.email = alarmStatus.isEmail();
		this.push = alarmStatus.isPush();
	}
}
