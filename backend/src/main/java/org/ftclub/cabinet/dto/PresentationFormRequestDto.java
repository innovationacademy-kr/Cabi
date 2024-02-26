package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import javax.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationTime;

@AllArgsConstructor
@Getter
@ToString
public class PresentationFormRequestDto {

	private final Category category;
	private final PresentationTime presentationTime;
	private final PresentationLocation presentationLocation;
	private final LocalDateTime dateTime;
	@NotEmpty
	private final String subject;
	@NotEmpty
	private final String summary;
	@NotEmpty
	private final String detail;
}
