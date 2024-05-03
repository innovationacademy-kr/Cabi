package org.ftclub.cabinet.item.domain;


import static javax.persistence.FetchType.LAZY;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
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
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "SECTION_ALARM")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString(exclude = {"user", "cabinetPlace"})
@EntityListeners(AuditingEntityListener.class)
public class SectionAlarm {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	/**
	 * 알람 상태
	 */
	@Column(name = "ALARM_STATUS", nullable = false)
	@Enumerated(value = EnumType.STRING)
	private AlarmStatus alarmStatus;

	/**
	 * 알람 종류
	 */
	@Column(name = "SECTION_ALARM_TYPE", nullable = false)
	@Enumerated(value = EnumType.STRING)
	private SectionAlarmType sectionAlarmType;

	/**
	 * 알람 등록 시간
	 */
	@CreatedDate
	@Column(name = "REGISTERED_AT", nullable = false)
	private LocalDateTime registeredAt;

	/**
	 * 알람 발생 시간
	 */
	@Column(name = "ALARMED_AT")
	private LocalDateTime alarmedAt;

	/**
	 * 대여하는 유저
	 */
	@Column(name = "USER_ID", nullable = false)
	private Long userId;

	/**
	 * 알람 등록된 관심 사물함 영역
	 */
	@Column(name = "CABINET_PLACE_ID", nullable = false)
	private Long cabinetPlaceId;

	@JoinColumn(name = "USER_ID", nullable = false, insertable = false, updatable = false)
	@ManyToOne(fetch = LAZY)
	private User user;

	@JoinColumn(name = "CABINET_PLACE_ID", nullable = false, insertable = false, updatable = false)
	@ManyToOne(fetch = LAZY)
	private CabinetPlace cabinetPlace;

	protected SectionAlarm(Long userId, Long cabinetPlaceId,
			SectionAlarmType sectionAlarmType) {
		this.userId = userId;
		this.cabinetPlaceId = cabinetPlaceId;
		this.sectionAlarmType = sectionAlarmType;
		this.alarmStatus = AlarmStatus.ACTIVE;
	}

	/**
	 * @param userId           알람 발생 유저
	 * @param cabinetPlaceId   알람 발생 사물함 영역
	 * @param sectionAlarmType 알람 종류
	 * @return 인자 정보를 담고있는 {@link SectionAlarm}
	 */
	public static SectionAlarm of(Long userId, Long cabinetPlaceId,
			SectionAlarmType sectionAlarmType) {
		SectionAlarm sectionAlarm = new SectionAlarm(userId, cabinetPlaceId, sectionAlarmType);
		if (!sectionAlarm.isValid()) {
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		return sectionAlarm;
	}

	/**
	 * registeredAt, userId, cabinetPlaceId, alarmType 의 null 이 아닌지 확인합니다.
	 *
	 * @return 유효한 인스턴스 여부
	 */
	private boolean isValid() {
		return this.registeredAt != null && this.userId != null && this.cabinetPlaceId != null
				&& sectionAlarmType.isValid();
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
