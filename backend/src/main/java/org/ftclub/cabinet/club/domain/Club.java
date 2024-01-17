package org.ftclub.cabinet.club.domain;

import java.time.LocalDateTime;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;

@Entity
@Table(name = "CLUB")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class Club {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private long id;

	@NotNull
	@Column(name = "NAME", nullable = false)
	private String name;

	@CreatedDate
	private LocalDateTime createdAt;

	@Column(name = "DELETED_AT", length = 32)
	private LocalDateTime deletedAt;

	@OneToMany(mappedBy = "club")
	private List<ClubRegistration> clubRegistrations;

	@OneToMany(mappedBy = "club")
	private List<ClubLentHistory> clubLentHistories;
}
