package org.ftclub.cabinet.lent.domain;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;
import javax.persistence.Version;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "LENT_HISTORY", uniqueConstraints = {
		@UniqueConstraint(name = "unique_index", columnNames = {"LENT_HISTORY_ID", "VERSION"})
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class LentHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "LENT_HISTORY_ID")
	private Long lentHistoryId;

	@Version
	@Column(name = "VERSION")
	@Getter(AccessLevel.NONE)
	private Long version = 1L;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "STARTED_AT", nullable = false)
	private Date startedAt;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "EXPIRED_AT")
	private Date expiredAt = null;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "ENDED_AT")
	private Date endedAt = null;

	@Column(name = "USER_ID", nullable = false)
	private Long userId;

	@Column(name = "CABINET_ID", nullable = false)
	private Long cabinetId;

	protected LentHistory(Date startedAt, Date expiredAt, Long userId, Long cabinetId) {
		this.startedAt = startedAt;
		this.expiredAt = expiredAt;
		this.userId = userId;
		this.cabinetId = cabinetId;
	}

	public static LentHistory of(Date startedAt, Date expiredAt, Long userId, Long cabinetId) {
		return new LentHistory(startedAt, expiredAt, userId, cabinetId);
	}

	@Override
	public boolean equals(final Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof LentHistory)) {
            return false;
        }
		return (this.lentHistoryId.equals(((LentHistory) other).lentHistoryId));
	}

	public boolean isCabinetIdEqual(Long cabinetId) {
		return this.cabinetId.equals(cabinetId);
	}

	public void endLent(Date now) {
		this.endedAt = now;
	}
}
