package org.ftclub.cabinet.club.domain;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.utils.ExceptionUtil;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "CLUB_REGISTRATION")
@Getter
@ToString(exclude = {"user", "club"})
@Log4j2
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
public class ClubRegistration {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private long id;

	@Column(name = "USER_ID", nullable = false)
	private Long userId;

	@Column(name = "CLUB_ID", nullable = false)
	private Long clubId;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "USER_ROLE", length = 32, nullable = false)
	private UserRole userRole;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID", insertable = false, updatable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CLUB_ID", insertable = false, updatable = false)
	private Club club;

	@CreatedDate
	private LocalDateTime registeredAt;

	protected ClubRegistration(Long userId, Long clubId, UserRole userRole) {
		this.userId = userId;
		this.clubId = clubId;
		this.userRole = userRole;
	}

	public static ClubRegistration of(Long userId, Long clubId, UserRole userRole) {
		ClubRegistration clubRegistration = new ClubRegistration(userId, clubId, userRole);
		ExceptionUtil.throwIfFalse(clubRegistration.isValid(),
				new DomainException(ExceptionStatus.INVALID_ARGUMENT));
		return clubRegistration;
	}

	private boolean isValid() {
		return this.userId != null && this.clubId != null
				&& userRole.isValid();
	}

	public ClubRegistration changeUserRole(UserRole userRole) {
		this.userRole = userRole;
		return this;
	}
}
