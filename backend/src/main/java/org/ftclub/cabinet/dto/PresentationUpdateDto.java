package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import javax.validation.constraints.NotEmpty;
import lombok.Data;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;

@Data
public class PresentationUpdateDto {

	private final LocalDateTime dateTime;
	private final PresentationStatus status;
	private final PresentationLocation location;
}
