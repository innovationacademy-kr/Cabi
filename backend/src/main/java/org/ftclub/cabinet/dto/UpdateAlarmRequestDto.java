package org.ftclub.cabinet.dto;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.alarm.domain.AlarmType;

@ToString
@Getter
@AllArgsConstructor
public class UpdateAlarmRequestDto {

	private final boolean slack;
	private final boolean email;
	private final boolean push;

	public Map<AlarmType, Boolean> getAlarmTypeStatus() {
		return Map.of(
				AlarmType.SLACK, slack,
				AlarmType.EMAIL, email,
				AlarmType.PUSH, push
		);
	}
}
