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

@Entity
@Table(name = "CLUB_LENT_HISTORY")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString(exclude = {"club", "cabinet"})
@Log4j2
public class ClubLentHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CLUB_ID")
	private Club club;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CABINET_ID")
	private Cabinet cabinet;

	@Column(name = "STARTED_AT", nullable = false)
	private LocalDateTime startedAt;

	@Column(name = "ENDED_AT", nullable = false)

	private LocalDateTime endedAt;
	@Column(name = "EXPIRED_AT")
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
