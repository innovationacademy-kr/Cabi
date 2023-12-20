package org.ftclub.cabinet.alarm.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.ftclub.cabinet.alarm.domain.AlarmType;

@AllArgsConstructor
@Getter
public class AlarmTypeResponseDto {

	private boolean slack;
	private boolean email;
	private boolean push;

	@Builder
	public AlarmTypeResponseDto(List<AlarmType> alarmTypes) {
		alarmTypes.forEach(alarmType -> {
			switch (alarmType) {
				case SLACK:
					this.slack = true;
					break;
				case EMAIL:
					this.email = true;
					break;
				case PUSH:
					this.push = true;
					break;
			}
		});
	}
}
