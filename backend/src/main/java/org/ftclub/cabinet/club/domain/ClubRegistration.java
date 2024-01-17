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
import org.ftclub.cabinet.user.domain.User;
import org.springframework.data.annotation.CreatedDate;

@Entity
@Table(name = "CLUB_REGISTRATION")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString(exclude = {"user", "club"})
@Log4j2
public class ClubRegistration {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID")
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CLUB_ID")
	private Club club;

	@CreatedDate
	private LocalDateTime registeredAt;

}
