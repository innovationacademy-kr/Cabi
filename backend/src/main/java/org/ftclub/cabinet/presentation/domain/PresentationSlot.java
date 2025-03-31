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
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "PRESENTATION_SLOT")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PresentationSlot {

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	@Id
	private Long id;

	@Column(name = "START_TIME", nullable = false)
	private LocalDateTime startTime;

	@Enumerated(value = EnumType.STRING)
	private PresentationLocation presentationLocation = PresentationLocation.BASEMENT;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PRESENTATION_ID")
	private Presentation presentation;

	public PresentationSlot(LocalDateTime startTime, PresentationLocation presentationLocation) {
		this.startTime = startTime;
		this.presentationLocation = presentationLocation;
		this.presentation = null;
	}
}
