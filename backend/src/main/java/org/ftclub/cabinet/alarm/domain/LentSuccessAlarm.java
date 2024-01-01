package org.ftclub.cabinet.alarm.domain;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.cabinet.domain.Location;

/**
 * 대여 성공 알람
 */
@Getter
@ToString
@AllArgsConstructor
public class LentSuccessAlarm implements Alarm, TransactionalAlarmEvent {

	private final Location location;
	private final Integer visibleNum;
	private final LocalDateTime lentExpirationDate;
}
