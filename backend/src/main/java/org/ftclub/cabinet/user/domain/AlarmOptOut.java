package org.ftclub.cabinet.user.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.alarm.domain.AlarmType;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.ExceptionUtil;

import javax.persistence.*;

/**
 * 유저의 알람 수신 거부 정보 엔티티입니다.
 */
@Entity
@Table(name = "ALARM_OPT_OUT")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class AlarmOptOut {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "ALARM_TYPE", length = 32)
	private AlarmType alarmType;

	@ManyToOne
	@JoinColumn(name = "USER_ID", nullable = false)
	private User user;

	private AlarmOptOut(User user, AlarmType alarmType) {
		this.user = user;
		this.alarmType = alarmType;
	}

	public static AlarmOptOut of(User user, AlarmType alarmType) {
		AlarmOptOut alarmOptOut = new AlarmOptOut(user, alarmType);
		ExceptionUtil.throwIfFalse(alarmOptOut.isValid(),
				new DomainException(ExceptionStatus.INVALID_ARGUMENT));
		return alarmOptOut;
	}

	private boolean isValid() {
		return user != null && alarmType != null;
	}
}
