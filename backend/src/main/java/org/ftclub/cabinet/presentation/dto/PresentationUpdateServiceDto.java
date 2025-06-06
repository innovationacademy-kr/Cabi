package org.ftclub.cabinet.presentation.dto;

import java.util.Set;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PresentationUpdateServiceDto {

	private final String summary;
	private final String outline;
	private final String detail;
	private final boolean publicAllowed;
	private final boolean thumbnailUpdated;

	private final Set<String> toUpdate = Set.of("summary", "outline", "detail", "publicAllowed");
}
