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
import org.ftclub.cabinet.exception.ExceptionStatus;

@Entity
@Getter
@Table(name = "PRESENTATION_SLOT")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PresentationSlot {

	public static final int PRESENTATION_SLOT_DURATION = 30; // 30분

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

	public void changeSlotStartTime(LocalDateTime startTime) {
		if (this.startTime.isBefore(java.time.LocalDateTime.now())) {
			throw ExceptionStatus.CANNOT_CREATE_SLOT_IN_PAST.asDomainException();
		}
		this.startTime = startTime;
	}

	public void changeSlotLocation(PresentationLocation location) {
		this.presentationLocation = location;
	}

	public boolean hasPresentation() {
		return this.presentation != null;
	}

	public void assignPresentation(Presentation presentation) {
		if (this.presentation != null) {
			throw ExceptionStatus.PRESENTATION_SLOT_ALREADY_ASSIGNED.asDomainException();
		}
		this.presentation = presentation;
	}

}
