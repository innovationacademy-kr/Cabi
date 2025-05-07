package org.ftclub.cabinet.presentation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PresentationFormRequestDto {

	// TODO: ENUM과 다른 값에 대한 처리
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

	// TODO: 유효한 슬롯인지 확인하는 로직 필요
	@NotNull
	private Long slotId;

}
