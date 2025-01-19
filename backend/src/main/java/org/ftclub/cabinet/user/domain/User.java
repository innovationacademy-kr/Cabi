package org.ftclub.cabinet.user.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.alarm.dto.AlarmTypeResponseDto;
import org.ftclub.cabinet.auth.domain.FtRole;
import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.ftclub.cabinet.dto.UpdateAlarmRequestDto;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.ExceptionUtil;

@Entity
@Table(name = "USER")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString(exclude = {"joinedClubs"})
@Log4j2
public class User {


	@OneToMany(mappedBy = "user")
	private final List<ClubRegistration> joinedClubs = new ArrayList<>();
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;
	@NotNull
	@Column(name = "NAME", length = 32, unique = true, nullable = false)
	private String name;
	@Email
	@Column(name = "EMAIL", unique = true)
	private String email;
	@Column(name = "BLACKHOLED_AT")
	private LocalDateTime blackholedAt = null;
	@Column(name = "DELETED_AT", length = 32)
	private LocalDateTime deletedAt = null;
	@Enumerated(value = EnumType.STRING)
	@Column(name = "ROLE", length = 32, nullable = false)
	private FtRole role;
	@Column(name = "SLACK_ALARM", columnDefinition = "boolean default true")
	private boolean slackAlarm;
	@Column(name = "EMAIL_ALARM", columnDefinition = "boolean default true")
	private boolean emailAlarm;
	@Column(name = "PUSH_ALARM", columnDefinition = "boolean default false")
	private boolean pushAlarm;

	@NotNull
	@Column(name = "COIN")
	private Long coin;

	protected User(String name, String email, LocalDateTime blackholedAt, FtRole role) {
		this.name = name;
		this.email = email;
		this.blackholedAt = blackholedAt;
		this.coin = 0L;
		this.role = role;
		setDefaultAlarmStatus();
	}

	public static User of(String name, String email, LocalDateTime blackholedAt, FtRole role) {
		User user = new User(name, email, blackholedAt, role);
		ExceptionUtil.throwIfFalse(user.isValid(),
				new DomainException(ExceptionStatus.INVALID_ARGUMENT));
		return user;
	}


	private void setDefaultAlarmStatus() {
		this.slackAlarm = true;
		this.emailAlarm = true;
		this.pushAlarm = false;
	}

	private boolean isValid() {
		return name != null && email != null && Pattern.matches(
				"^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\\.[A-Za-z0-9\\-]+\\.*[A-Za-z0-9\\-]*", email);
//				&& role != null && role.isValid();
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		User user = (User) o;
		return Objects.equals(id, user.id);
	}

//	public boolean isUserRole(UserRole role) {
//		return role.equals(this.role);
//	}

	public void changeBlackholedAt(LocalDateTime blackholedAt) {
		log.info("Called changeBlackholedAt - form {} to {}", this.blackholedAt, blackholedAt);
		this.blackholedAt = blackholedAt;
	}

	public void setDeletedAt(LocalDateTime deletedAt) {
		log.info("Called setDeletedAt - from {} to {}", this.deletedAt, deletedAt);
		this.deletedAt = deletedAt;
	}

	public void changeName(String name) {
		log.info("Called changeName - from {} to {}", this.name, name);
		this.name = name;
		ExceptionUtil.throwIfFalse(this.isValid(),
				new DomainException(ExceptionStatus.INVALID_ARGUMENT));
	}

	public String getBlackholedAtString() {
		if (blackholedAt == null) {
			return null;
		}
		return blackholedAt.toString();
	}

	public AlarmTypeResponseDto getAlarmTypes() {
		return new AlarmTypeResponseDto(slackAlarm, emailAlarm, pushAlarm);
	}

	public void changeAlarmStatus(UpdateAlarmRequestDto updateAlarmRequestDto) {
		this.slackAlarm = updateAlarmRequestDto.isSlack();
		this.emailAlarm = updateAlarmRequestDto.isEmail();
		this.pushAlarm = updateAlarmRequestDto.isPush();
	}

	public boolean isBlackholed() {
		return blackholedAt != null && blackholedAt.isBefore(LocalDateTime.now());
	}

	/**
	 * this.blackholedAt과 전달인자 blackholedAt 중 어느 하나가 null인 경우 false를 반환
	 *
	 * @param blackholedAt
	 * @return
	 */
	public boolean isSameBlackholedAt(LocalDateTime blackholedAt) {
		if (this.blackholedAt == null || blackholedAt == null) {
			return this.blackholedAt == null && blackholedAt == null;
		}

		return this.blackholedAt.isEqual(blackholedAt);
	}


	public void addCoin(Long reward) {
		this.coin += reward;
	}

}
