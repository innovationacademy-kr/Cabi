package org.ftclub.cabinet.user.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.dto.UpdateAlarmRequestDto;

/**
 * 유저의 알람 수신 거부 정보 엔티티입니다.
 */
@Entity
@Table(name = "ALARM_STATUS")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString(exclude = {"user"})
public class AlarmStatus {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Column(name = "slack", nullable = false)
	private boolean slack;

	@Column(name = "email", nullable = false)
	private boolean email;

	@Column(name = "push", nullable = false)
	private boolean push;

	@OneToOne
	@JoinColumn(name = "USER_ID", nullable = false)
	private User user;

	private AlarmStatus(User user, boolean slack, boolean email, boolean push) {
		this.user = user;
		this.slack = slack;
		this.email = email;
		this.push = push;
	}

	public static AlarmStatus of(User user) {
		return new AlarmStatus(user, true, true, true);
	}

	public static AlarmStatus of(User user, UpdateAlarmRequestDto dto) {
		return new AlarmStatus(user, dto.isSlack(), dto.isEmail(), dto.isPush());
	}

	public void update(UpdateAlarmRequestDto dto) {
		this.slack = dto.isSlack();
		this.email = dto.isEmail();
		this.push = dto.isPush();
	}

}
