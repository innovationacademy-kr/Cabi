package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import lombok.Data;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;
import org.ftclub.cabinet.presentation.domain.PresentationTime;

@Data
public class PresentationFormData {

	private final Long id;
	private final PresentationStatus presentationStatus;
	private final PresentationTime presentationTime;
	private final PresentationLocation presentationLocation;
	private final String subject;
	private final String summery;
	private final String detail;
	private final Category category;
	private final LocalDateTime dateTime;
	private final String userName;

}
