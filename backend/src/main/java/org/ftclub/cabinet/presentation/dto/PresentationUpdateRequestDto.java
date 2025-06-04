package org.ftclub.cabinet.presentation.dto;

import javax.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.presentation.domain.ThumbnailAction;
import org.hibernate.validator.constraints.Length;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PresentationUpdateRequestDto {

	@NotBlank
	@Length(min = 1, max = 100)
	private String summary;
	@NotBlank
	@Length(min = 1, max = 500)
	private String outline;
	@NotBlank
	@Length(min = 1, max = 10000)
	private String detail;

	private boolean publicAllowed;
	private ThumbnailAction thumbnailAction;
}
