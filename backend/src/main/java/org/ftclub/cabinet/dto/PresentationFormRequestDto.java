package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import javax.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationTime;
import org.hibernate.validator.constraints.Length;

@AllArgsConstructor
@Getter
@ToString
public class PresentationFormRequestDto {

	private final Category category;
	private final PresentationTime presentationTime;
	private final PresentationLocation presentationLocation;
	private final LocalDateTime dateTime;
	@NotBlank
	@Length(min = 1, max = 25)
	private final String subject;
	@NotBlank
	@Length(min = 1, max = 40)
	private final String summary;
	@NotBlank
	@Length(min = 1, max = 500)
	private final String detail;
}
