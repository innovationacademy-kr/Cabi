package org.ftclub.cabinet.presentation.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;
import org.hibernate.validator.constraints.Length;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PresentationFormRequestDto {

	@NotNull
	private Duration duration;
	@NotNull
	private Category category;

	@NotBlank
	@Length(min = 1, max = 50)
	private String title;
	@NotBlank
	@Length(min = 1, max = 100)
	private String summary;
	@NotBlank
	@Length(min = 1, max = 500)
	private String outline;
	@NotBlank
	@Length(min = 1, max = 10000)
	private String detail;

	@NotNull
	private Boolean isRecordingAllowed;
	@NotNull
	private Boolean isPublicAllowed;

	@NotNull
	private Long slotId;

}
