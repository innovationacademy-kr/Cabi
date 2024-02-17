package org.ftclub.cabinet.club.domain;

import java.time.LocalDateTime;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.ExceptionUtil;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "CLUB")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@EntityListeners(AuditingEntityListener.class)
@ToString(exclude = {"clubRegistrations", "clubLentHistories"})
public class Club {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private long id;

	@NotNull
	@Column(name = "NAME", unique = true, nullable = false)
	private String name;

	@CreatedDate
	@Column(name = "CREATED_AT", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "DELETED_AT", length = 32)
	private LocalDateTime deletedAt;

	@Lob
	@Column(name = "NOTICE", nullable = false)
	private String notice = "";


	@OneToMany(mappedBy = "club", fetch = FetchType.LAZY)
	private List<ClubRegistration> clubRegistrations;

	@OneToMany(mappedBy = "club", fetch = FetchType.LAZY)
	private List<ClubLentHistory> clubLentHistories;

	protected Club(String name) {
		this.name = name;
	}

	public static Club of(String name) {
		Club club = new Club(name);
		ExceptionUtil.throwIfFalse(club.isValid(),
				new DomainException(ExceptionStatus.INVALID_ARGUMENT));
		return club;
	}

	private boolean isValid() {
		return name != null;
	}

	public void delete() {
		this.deletedAt = LocalDateTime.now();
	}

	public void changeClubName(String clubName) {
		if (clubName == null || clubName.isEmpty()) {
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		this.name = clubName;
	}

	public void changeClubNotice(String notice) {
		if (notice == null) {
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		this.notice = notice;
	}
}
