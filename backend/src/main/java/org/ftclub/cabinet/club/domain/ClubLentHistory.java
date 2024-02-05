package org.ftclub.cabinet.club.domain;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
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
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.utils.DateUtil;
import org.ftclub.cabinet.utils.ExceptionUtil;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Log4j2
@ToString(exclude = {"club", "cabinet"})
@Getter
@Table(name = "CLUB_LENT_HISTORY")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class ClubLentHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private long id;

	@Column(name = "CLUB_ID", nullable = false, updatable = false)
	private Long clubId;

	@Column(name = "CABINET_ID", nullable = false, updatable = false)
	private Long cabinetId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CLUB_ID", insertable = false, updatable = false)
	private Club club;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CABINET_ID", insertable = false, updatable = false)
	private Cabinet cabinet;

	@CreatedDate
	@Column(name = "STARTED_AT", nullable = false, updatable = false)
	private LocalDateTime startedAt;

	@Column(name = "ENDED_AT")
	private LocalDateTime endedAt;

	@Column(name = "EXPIRED_AT")
	private LocalDateTime expiredAt;

	protected ClubLentHistory(Long clubId, Long cabinetId, LocalDateTime endedAt) {
		this.clubId = clubId;
		this.cabinetId = cabinetId;
		this.endedAt = endedAt;
	}

	public static ClubLentHistory of(Long clubId, Long cabinetId, LocalDateTime endedAt) {
		ClubLentHistory clubLentHistory = new ClubLentHistory(clubId, cabinetId, endedAt);
		if (!clubLentHistory.isValid()) {
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		return clubLentHistory;
	}

	private boolean isValid() {
		return clubId != null && cabinetId != null && startedAt != null && endedAt != null;
	}

	@Logging(level = LogLevel.DEBUG)
	public void endLent(LocalDateTime now) {
		ExceptionUtil.throwIfFalse((this.isEndLentValid(now)),
				ExceptionStatus.INVALID_ARGUMENT.asDomainException());
		this.endedAt = now;
		ExceptionUtil.throwIfFalse((this.isValid()),
				ExceptionStatus.INVALID_ARGUMENT.asDomainException());
	}

	private boolean isEndLentValid(LocalDateTime endedAt) {
		return endedAt != null && DateUtil.calculateTwoDateDiff(endedAt, this.startedAt) >= 0;
	}
}
