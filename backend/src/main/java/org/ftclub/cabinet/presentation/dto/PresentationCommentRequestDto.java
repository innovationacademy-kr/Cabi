package org.ftclub.cabinet.presentation.dto;

import javax.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PresentationCommentRequestDto {

	@NotBlank
	private String detail;
}
