package org.ftclub.cabinet.presentation.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class PresentationPageResponseDto {

	private final List<PresentationSummaryDto> content;
	private final int currentPage;
	private final int totalPage;
	private final long totalElements;
	private final boolean last;
}
