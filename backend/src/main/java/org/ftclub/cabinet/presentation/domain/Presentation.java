package org.ftclub.cabinet.presentation.domain;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import org.ftclub.cabinet.cabinet.domain.Location;

@Entity
@Getter
public class Presentation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	Long id;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "CATEGORY")
	Category category;

	@Column(name = "DATE_TIME")
	LocalDateTime dateTime;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "PRESENTATION_TIME")
	PresentationTime presentationTime;

	@Column(name = "SUBJECT")
	String subject;

	@Column(name = "SUMMARY")
	String summary;

	@Column(name = "DETAIL")
	String detail;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "PRESENTATION_STATUS")
	PresentationStatus presentationStatus;

	@Embedded
	Location location;

	protected Presentation(Category category, LocalDateTime dateTime,
			PresentationTime presentationTime, String subject, String summary, String detail) {
		this.category = category;
		this.dateTime = dateTime;
		this.presentationTime = presentationTime;
		this.subject = subject;
		this.detail = detail;
	}

	public static Presentation of(Category category, LocalDateTime dateTime,
			PresentationTime presentationTime, String subject, String summary, String detail) {
		Presentation presentation = new Presentation(category, dateTime, presentationTime, subject,
				summary, detail);
		return (presentation);
	}

}
