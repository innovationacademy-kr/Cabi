package org.ftclub.cabinet.user.domain;

import static javax.persistence.FetchType.LAZY;

import java.util.Date;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.ExceptionUtil;

@Entity
@Table(name = "BAN_HISTORY")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class BanHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "BAN_HISTORY_ID")
	private long banHistoryId;

	@Temporal(TemporalType.TIMESTAMP)
	@NotNull
	@Column(name = "BANNED_AT", nullable = false)
	private Date bannedAt;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "UNBANNED_AT")
	private Date unbannedAt;

	@Enumerated(EnumType.STRING)
	@Column(name = "BAN_TYPE", length = 32, nullable = false)
	private BanType banType;

	@NotNull
	@Column(name = "USER_ID", nullable = false)
	private Long userId;

	@JoinColumn(name = "USER_ID", insertable = false, updatable = false)
	@ManyToOne(fetch = LAZY)
	private User user;

	protected BanHistory(Date bannedAt, Date unbannedAt, BanType banType,
			Long userId) {
		this.bannedAt = bannedAt;
		this.unbannedAt = unbannedAt;
		this.banType = banType;
		this.userId = userId;
	}

	public static BanHistory of(Date bannedAt, Date unbannedAt, BanType banType,
			Long userId) {
		BanHistory banHistory = new BanHistory(bannedAt, unbannedAt, banType, userId);
		ExceptionUtil.throwIfFalse(banHistory.isValid(),
				new DomainException(ExceptionStatus.INVALID_ARGUMENT));
		return banHistory;
	}

	private boolean isValid() {
		return bannedAt != null && banType != null && banType.isValid() && userId != null;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		BanHistory banHistory = (BanHistory) o;
		return Objects.equals(banHistoryId, banHistory.banHistoryId);
	}

	public boolean isBanEndedBefore(Date date) {
		return date.before(unbannedAt);
	}
}