package org.ftclub.cabinet.item.domain;


import static javax.persistence.FetchType.LAZY;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.User;

@Entity
@Table(name = "section_alarm")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString(exclude = {"user", "cabinetPlace"})
public class SectionAlarm {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(name = "alarm_status")
	@Enumerated(value = EnumType.STRING)
	private AlarmStatus alarmStatus;

	@Column(name = "registered_at", nullable = false)
	private LocalDateTime registeredAt;

	@Column(name = "alarmed_at")
	private LocalDateTime alarmedAt;

	@Column(name = "alarm_type")
	@Enumerated(value = EnumType.STRING)
	private AlarmType alarmType;

	/**
	 * 대여하는 유저
	 */
	@Column(name = "user_id", nullable = false)
	private Long userId;

	/**
	 * 알람 등록된 관심 사물함 영역
	 */
	@Column(name = "cabinet_place_id", nullable = false)
	private Long cabinetPlaceId;

	@JoinColumn(name = "user_id", nullable = false, insertable = false, updatable = false)
	@ManyToOne(fetch = LAZY)
	private User user;

	@JoinColumn(name = "cabinet_place_id", nullable = false, insertable = false, updatable = false)
	@ManyToOne(fetch = LAZY)
	private CabinetPlace cabinetPlace;

	protected SectionAlarm(LocalDateTime registeredAt, Long userId, Long cabinetPlaceId,
			AlarmType alarmType) {
		this.registeredAt = registeredAt;
		this.userId = userId;
		this.cabinetPlaceId = cabinetPlaceId;
		this.alarmType = alarmType;
	}

	public static SectionAlarm of(LocalDateTime registeredAt, Long userId, Long cabinetPlaceId,
			AlarmType alarmType) {
		SectionAlarm sectionAlarm = new SectionAlarm(registeredAt, userId, cabinetPlaceId,
				alarmType);
		if (!sectionAlarm.isValid()) {
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		return sectionAlarm;
	}

	private boolean isValid() {
		return this.registeredAt != null && this.userId != null && this.cabinetPlaceId != null
				&& alarmType.isValid();
	}

	@Override
	public boolean equals(final Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof SectionAlarm)) {
			return false;
		}
		return (this.id.equals(((SectionAlarm) other).id));
	}
}
