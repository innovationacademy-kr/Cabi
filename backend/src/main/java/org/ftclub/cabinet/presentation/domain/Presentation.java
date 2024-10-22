package org.ftclub.cabinet.presentation.domain;

import java.time.LocalDateTime;
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
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.ftclub.cabinet.user.domain.User;

@Entity
@Getter
@Table(name = "PRESENTATION")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Presentation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "PRESENTATION_STATUS")
	private PresentationStatus presentationStatus;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "PRESENTATION_TIME")
	private PresentationTime presentationTime;

	@Column(name = "SUBJECT", length = 25)
	private String subject;

	@Column(name = "SUMMARY", length = 40)
	private String summary;

	@Column(name = "DETAIL", length = 500)
	private String detail;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "CATEGORY")
	private Category category;

	@Column(name = "DATE_TIME")
	private LocalDateTime dateTime;

	@Enumerated(value = EnumType.STRING)
	private PresentationLocation presentationLocation;

	@Setter
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID", nullable = true)
	private User user;

	protected Presentation(Category category, LocalDateTime dateTime,
			PresentationTime presentationTime, String subject, String summary, String detail) {
		this.category = category;
		this.dateTime = dateTime;
		this.presentationTime = presentationTime;
		this.subject = subject;
		this.detail = detail;
		this.summary = summary;
		this.presentationStatus = PresentationStatus.EXPECTED;
		this.presentationLocation = PresentationLocation.BASEMENT;
	}

	public static Presentation of(Category category, LocalDateTime dateTime,
			PresentationTime presentationTime, String subject, String summary, String detail) {

		return new Presentation(category, dateTime, presentationTime, subject, summary, detail);
	}

	public void adminUpdate(PresentationStatus newStatus, LocalDateTime newDateTime,
			PresentationLocation newLocation) {
		this.presentationStatus = newStatus;
		this.dateTime = newDateTime;
		this.presentationLocation = newLocation;
	}

	public void updateDummyToUserForm(Category category,
			PresentationTime presentationTime, LocalDateTime presentationDateTime,
			String subject, String summary, String detail) {
		this.category = category;
		this.presentationTime = presentationTime;
		this.dateTime = presentationDateTime;
		this.subject = subject;
		this.summary = summary;
		this.detail = detail;
	}
}
