package org.ftclub.cabinet.presentation.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresentationLikeServiceDto {

	private Long userId;
	private Long presentationId;
}
