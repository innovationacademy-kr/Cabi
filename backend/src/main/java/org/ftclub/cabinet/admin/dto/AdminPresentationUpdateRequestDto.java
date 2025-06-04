package org.ftclub.cabinet.admin.dto;

import javax.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;
import org.ftclub.cabinet.presentation.domain.ThumbnailAction;
import org.hibernate.validator.constraints.Length;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AdminPresentationUpdateRequestDto {

	private Duration duration;
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

	@Length(max = 2048)
	private String videoLink;

	private boolean recordingAllowed;
	private boolean publicAllowed;
	private ThumbnailAction thumbnailAction;
}
