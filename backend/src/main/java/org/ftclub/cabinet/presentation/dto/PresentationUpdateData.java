package org.ftclub.cabinet.presentation.dto;

import lombok.Builder;
import lombok.Getter;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;

/**
 * 프레젠테이션 도메인 수정 DTO
 */
@Getter
@Builder
public class PresentationUpdateData {

	// --- [ADMIN, USER] common field ---
	private final String summary;
	private final String outline;
	private final String detail;
	private final boolean publicAllowed;
	private final String thumbnailS3Key;

	// --- [ADMIN] field ---
	private final Duration duration;
	private final Category category;
	private final String title;
	private final String videoLink;
	private final boolean recordingAllowed;
}
