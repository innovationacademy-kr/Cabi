package org.ftclub.cabinet.presentation.domain;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.user.domain.User;

@Entity
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
	@Column(name = "SPEAKING_TIME")
	SpeakingTime speakingTime;

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
}
