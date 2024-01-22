package org.ftclub.cabinet.club.domain;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
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

@Log4j2
@ToString(exclude = {"club", "cabinet"})
@Getter
@Table(name = "CLUB_LENT_HISTORY")
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ClubLentHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private long id;

	@Column(name = "CLUB_ID", nullable = false)
	private Long clubId;

	@Column(name = "CABINET_ID", nullable = false)
	private Long cabinetId;

	@JoinColumn(name = "CLUB_ID", insertable = false, updatable = false)
	@ManyToOne(fetch = FetchType.LAZY)
	private Club club;

	@JoinColumn(name = "CABINET_ID", insertable = false, updatable = false)
	@ManyToOne(fetch = FetchType.LAZY)
	private Cabinet cabinet;

	@Column(name = "STARTED_AT", nullable = false)
	private LocalDateTime startedAt;

	@Column(name = "ENDED_AT")
	private LocalDateTime endedAt;

	@Column(name = "EXPIRED_AT", nullable = false)
	private LocalDateTime expiredAt;

	protected ClubLentHistory(Club club, Cabinet cabinet, LocalDateTime startedAt,
			LocalDateTime endedAt) {
		this.club = club;
		this.cabinet = cabinet;
		this.startedAt = startedAt;
		this.endedAt = endedAt;
	}

	public static ClubLentHistory of(Club club, Cabinet cabinet, LocalDateTime startedAt,
			LocalDateTime endedAt) {
		return new ClubLentHistory(club, cabinet, startedAt, endedAt);
	}

}
