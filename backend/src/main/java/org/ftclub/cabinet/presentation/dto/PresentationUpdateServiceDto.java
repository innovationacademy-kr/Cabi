package org.ftclub.cabinet.presentation.dto;

import lombok.Builder;
import lombok.Getter;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;

/**
 * 프레젠테이션 수정을 위한 공통 DTO
 * <p>
 * USER-toUpdate: summary, outline, detail, publicAllowed, thumbnailS3Key
 * </p>
 * <p>
 * ADMIN-toUpdate: USER-toUpdate + { title, category, duration, videoLink, recordingAllowed }
 * </p>
 */
@Getter
@Builder
public class PresentationUpdateServiceDto {

	// --- [ADMIN, USER] common field ---
	private final String summary;
	private final String outline;
	private final String detail;
	private final boolean publicAllowed;

	// --- [ADMIN] field ---
	private final Duration duration;
	private final Category category;
	private final String title;
	private final String videoLink;
	private final boolean recordingAllowed;
}
