package org.ftclub.cabinet.alarm.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * AGU 유저 임시 로그인 링크
 */
@Getter
@ToString
@AllArgsConstructor
public class EmailVerificationAlarm implements Alarm {

	private final String verificationLink;
}
