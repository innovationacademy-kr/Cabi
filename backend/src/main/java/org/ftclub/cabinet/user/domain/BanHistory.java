package org.ftclub.cabinet.user.domain;

import java.util.Date;
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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "BAN_HISTORY")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class BanHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "BAN_HISTORY_ID")
	private Long banHistoryId;

	@Column(name = "CABINET_ID", nullable = false)
	private Long cabinetId;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "BANNED_AT", nullable = false)
	private Date bannedAt;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "UNBANNED_AT")
	private Date unbannedAt;

	@Enumerated(EnumType.STRING)
	@Column(name = "BAN_TYPE", length = 32, nullable = false)
	private BanType banType;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID", nullable = false)
	private User user;

	protected BanHistory(Long cabinetId, Date bannedAt, Date unbannedAt, BanType banType,
			User user) {
		this.cabinetId = cabinetId;
		this.bannedAt = bannedAt;
		this.unbannedAt = unbannedAt;
		this.banType = banType;
		this.user = user;
	}

	public static BanHistory of(Long cabinetId, Date bannedAt, Date unbannedAt, BanType banType,
			User user) {
		return new BanHistory(cabinetId, bannedAt, unbannedAt, banType, user);
	}

	@Override
	public boolean equals(final Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof BanHistory)) {
            return false;
        }
		return (this.banHistoryId.equals(((BanHistory) other).banHistoryId));
	}

	public BanType getBanType() {
		return banType;
	}

	public boolean isBanEnd() {
		return new Date().before(unbannedAt);
	}
}
