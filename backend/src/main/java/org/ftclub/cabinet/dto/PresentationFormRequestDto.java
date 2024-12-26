package org.ftclub.cabinet.dto;

import java.time.LocalDateTime;
import javax.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationTime;
import org.hibernate.validator.constraints.Length;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class PresentationFormRequestDto {

	private Category category;
	private PresentationTime presentationTime;
	private PresentationLocation presentationLocation;
	private LocalDateTime dateTime;
	@NotBlank
	@Length(min = 1, max = 25)
	private String subject;
	@NotBlank
	@Length(min = 1, max = 40)
	private String summary;
	@NotBlank
	@Length(min = 1, max = 500)
	private String detail;
}
