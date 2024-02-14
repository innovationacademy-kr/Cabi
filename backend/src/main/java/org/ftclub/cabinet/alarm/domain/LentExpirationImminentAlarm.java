package org.ftclub.cabinet.alarm.domain;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * 대여 만료 임박 알람
 */
@Getter
@ToString
@AllArgsConstructor
public class LentExpirationImminentAlarm implements Alarm {

	private final Long daysFromExpireDate;

	public String getExpirationDateAsString() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime expireDate = now.plusDays(Math.abs(daysFromExpireDate));
		return expireDate.format(DateTimeFormatter.ofPattern("YYYY년 MM월 dd일"));
	}

	public boolean isExpirationToday() {
		return daysFromExpireDate == 0L;
	}
}
